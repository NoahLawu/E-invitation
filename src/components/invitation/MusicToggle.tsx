"use client";

import {
  useEffect,
  useImperativeHandle,
  useState,
  type Ref,
  type RefObject,
} from "react";
import { applyMusicVolume } from "@/lib/music-level";

export type MusicToggleHandle = {
  start: () => void;
};

export function MusicToggle({
  mediaRef,
  volume = 100,
  visible = true,
  ref,
}: {
  mediaRef: RefObject<HTMLVideoElement | null>;
  volume?: number;
  visible?: boolean;
  ref?: Ref<MusicToggleHandle>;
}) {
  const [enabled, setEnabled] = useState(false);
  const percent = Math.min(100, Math.max(1, volume));

  function start() {
    const media = mediaRef.current;
    if (!media) {
      return;
    }
    media.currentTime = 0;
    media.muted = false;
    applyMusicVolume(media, percent);
    const playing = media.play();
    setEnabled(true);
    void playing.catch(() => setEnabled(false));
  }

  useImperativeHandle(ref, () => ({ start }));

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !enabled) {
      return;
    }
    media.muted = false;
    applyMusicVolume(media, percent);
    void media.play().catch(() => setEnabled(false));
  }, [enabled, mediaRef, percent]);

  function stop() {
    const media = mediaRef.current;
    if (media) {
      applyMusicVolume(media, 0);
    }
    setEnabled(false);
  }

  return (
    <>
      {visible ? (
        <button
          type="button"
          aria-pressed={enabled}
          aria-label={enabled ? "Pause music" : "Play music"}
          onClick={() => {
            if (enabled) {
              stop();
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
