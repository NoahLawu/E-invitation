"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";

export type MusicToggleHandle = {
  start: () => void;
};

export function MusicToggle({
  src,
  volume = 100,
  visible = true,
  ref,
}: {
  src: string;
  volume?: number;
  visible?: boolean;
  ref?: Ref<MusicToggleHandle>;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const level = Math.min(100, Math.max(1, volume)) / 100;

  function applyVolume(audio: HTMLAudioElement) {
    audio.volume = level;
  }

  function start() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    applyVolume(audio);
    const playing = audio.play();
    setEnabled(true);
    void playing.catch(() => setEnabled(false));
  }

  useImperativeHandle(ref, () => ({ start }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    applyVolume(audio);
    if (enabled) {
      void audio.play().catch(() => setEnabled(false));
      return;
    }
    audio.pause();
  }, [enabled, level]);

  if (!src) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      {visible ? (
        <button
          type="button"
          aria-pressed={enabled}
          aria-label={enabled ? "Pause music" : "Play music"}
          onClick={() => {
            if (enabled) {
              audioRef.current?.pause();
              setEnabled(false);
              return;
            }
            start();
          }}
          className="fixed right-[max(1rem,calc(50%-215px+1rem))] bottom-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-accent shadow-sm"
        >
          {enabled ? (
            <span aria-hidden className="text-lg leading-none">
              ♪
            </span>
          ) : (
            <span aria-hidden className="text-xs tracking-wide">
              off
            </span>
          )}
        </button>
      ) : null}
    </>
  );
}
