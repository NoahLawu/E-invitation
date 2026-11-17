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
  prime: () => void;
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

  function playMuted(media: HTMLVideoElement) {
    media.muted = true;
    media.playsInline = true;
    return media.play();
  }

  function prime() {
    const media = mediaRef.current;
    if (!media) {
      return;
    }
    void playMuted(media);
  }

  function start() {
    const media = mediaRef.current;
    if (!media) {
      return;
    }
    const playing = media.paused ? playMuted(media) : Promise.resolve();
    media.muted = false;
    applyMusicVolume(media, percent);
    setEnabled(true);
    void playing.catch(() => {
      setEnabled(false);
      void playMuted(media);
    });
  }

  useImperativeHandle(ref, () => ({ prime, start }));

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !enabled) {
      return;
    }
    media.muted = false;
    applyMusicVolume(media, percent);
  }, [enabled, mediaRef, percent]);

  function stop() {
    const media = mediaRef.current;
    if (media) {
      media.muted = true;
      applyMusicVolume(media, 0);
      if (media.paused) {
        void media.play();
      }
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
