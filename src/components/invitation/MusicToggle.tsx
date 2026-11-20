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
  start: (fromBeginning?: boolean) => void;
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

  function start(fromBeginning = false) {
    const media = mediaRef.current;
    if (!media) {
      return;
    }
    // Opening the invitation starts the video muted, so a swipe joins it mid-way.
    // Pause first: phones ignore a seek while the video is already playing.
    // The music button calls this without fromBeginning, so it never rewinds.
    if (fromBeginning) {
      media.pause();
      try {
        media.currentTime = 0;
      } catch {
        // The file can still be loading. Playback begins at the start once it can.
      }
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
          className="fixed right-[max(1rem,calc(50%-215px+1rem))] bottom-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-white/25 text-white shadow-sm backdrop-blur-md"
        >
          <span aria-hidden className="relative text-lg leading-none">
            ♪
            {enabled ? null : (
              <span className="absolute top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            )}
          </span>
        </button>
      ) : null}
    </>
  );
}
