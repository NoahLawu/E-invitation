type MusicGraph = {
  context: AudioContext;
  gain: GainNode;
};

const graphs = new WeakMap<HTMLAudioElement, MusicGraph>();

function audioContext() {
  const webkit = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Context = window.AudioContext ?? webkit.webkitAudioContext;
  return new Context();
}

/** 100 is the file’s original loudness. Phones ignore audio.volume, so the level goes through a gain node. */
export function applyMusicVolume(audio: HTMLAudioElement, percent: number) {
  const level = Math.min(1, Math.max(0.01, percent / 100));
  audio.volume = level;

  try {
    let graph = graphs.get(audio);
    if (!graph) {
      const context = audioContext();
      const source = context.createMediaElementSource(audio);
      const gain = context.createGain();
      source.connect(gain);
      gain.connect(context.destination);
      graph = { context, gain };
      graphs.set(audio, graph);
    }
    graph.gain.gain.setValueAtTime(level, graph.context.currentTime);
    audio.volume = 1;
    void graph.context.resume();
  } catch {
    audio.volume = level;
  }
}
