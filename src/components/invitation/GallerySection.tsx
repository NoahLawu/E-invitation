"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import { PhotoSlot } from "@/components/invitation/PhotoSlot";

const SWIPE_PX = 48;

export function GallerySection({ photos }: { photos: string[] }) {
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const moving = useRef(false);
  const looping = photos.length > 1;
  const frames = looping
    ? [photos[photos.length - 1], ...photos, photos[0]]
    : photos;
  const [pos, setPos] = useState(looping ? 1 : 0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (animate) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  function show(direction: -1 | 1) {
    if (moving.current || photos.length < 2) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAnimate(false);
      setPos((current) => wrap(current + direction, photos.length));
      return;
    }
    moving.current = true;
    setAnimate(true);
    setPos((current) => current + direction);
  }

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") {
      return;
    }
    moving.current = false;
    setPos((current) => {
      if (current <= 0) {
        setAnimate(false);
        return photos.length;
      }
      if (current >= photos.length + 1) {
        setAnimate(false);
        return 1;
      }
      return current;
    });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    start.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const origin = start.current;
    start.current = null;
    if (!origin || !looping) {
      return;
    }
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) {
      return;
    }
    show(dx < 0 ? 1 : -1);
  }

  return (
    <InvitationSection section="gallery">
      <div
        ref={copyRef}
        className={`flex w-full flex-col items-center ${fade.className}`}
        style={fade.style}
      >
        <p className="text-xs tracking-[0.3em] text-white uppercase">Gallery</p>
        {photos.length > 0 ? (
          <div className="relative mt-6 w-full">
            <div
              data-pager-allow=""
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                start.current = null;
              }}
              className="relative h-[58dvh] w-full overflow-hidden"
            >
              <div
                onTransitionEnd={onTransitionEnd}
                className={`flex h-full [backface-visibility:hidden] ${
                  animate
                    ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    : ""
                }`}
                style={{
                  width: `${frames.length * 100}%`,
                  transform: `translate3d(-${(pos * 100) / frames.length}%, 0, 0)`,
                }}
              >
                {frames.map((src, frameIndex) => (
                  <PhotoSlot
                    key={`${src}-${frameIndex}`}
                    src={src}
                    alt=""
                    sizes="430px"
                    bare
                    instant
                    className="h-full shrink-0"
                    style={{ width: `${100 / frames.length}%` }}
                  />
                ))}
              </div>
            </div>
            {looping ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => show(-1)}
                  className="gallery-arrow absolute top-1/2 left-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#e4e4e4]"
                >
                  <GalleryArrow direction="left" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => show(1)}
                  className="gallery-arrow absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#e4e4e4]"
                >
                  <GalleryArrow direction="right" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </InvitationSection>
  );
}

function wrap(position: number, count: number) {
  if (position <= 0) {
    return count;
  }
  if (position >= count + 1) {
    return 1;
  }
  return position;
}

function GalleryArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 24"
      aria-hidden
      className={`h-7 w-4 ${direction === "right" ? "rotate-180" : ""}`}
    >
      <path
        d="M12 3 L4 12 L12 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
