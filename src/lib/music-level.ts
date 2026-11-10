type MusicGraph = {
  context: AudioContext;
  gain: GainNode;
};

const graphs = new WeakMap<HTMLMediaElement, MusicGraph>();

function audioContext() {
  const webkit = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Context = window.AudioContext ?? webkit.webkitAudioContext;
  return new Context();
}

/** 100 is the file’s original loudness. 0 is silent. Phones ignore media.volume, so the level goes through a gain node. */
export function applyMusicVolume(media: HTMLMediaElement, percent: number) {
  const level =
    percent <= 0 ? 0 : Math.min(1, Math.max(0.01, percent / 100));
  media.volume = level;

  try {
    let graph = graphs.get(media);
    if (!graph) {
      const context = audioContext();
      const source = context.createMediaElementSource(media);
      const gain = context.createGain();
      source.connect(gain);
      gain.connect(context.destination);
      graph = { context, gain };
      graphs.set(media, graph);
    }
    graph.gain.gain.setValueAtTime(level, graph.context.currentTime);
    if (level > 0) {
      media.volume = 1;
    }
    void graph.context.resume();
  } catch {
    media.volume = level;
  }
}
