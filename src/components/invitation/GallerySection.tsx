"use client";

import { useRef, useState, type AnimationEvent, type PointerEvent } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import { PhotoSlot } from "@/components/invitation/PhotoSlot";

const SWIPE_PX = 48;

type GallerySlide = {
  direction: -1 | 1;
  from: string;
  to: string;
};

export function GallerySection({ photos }: { photos: string[] }) {
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const moving = useRef(false);
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState<GallerySlide | null>(null);
  const looping = photos.length > 1;
  const photo = photos[index] ?? photos[0] ?? "";

  function show(direction: -1 | 1) {
    if (moving.current || photos.length < 2) {
      return;
    }
    const from = index;
    const to =
      direction === 1
        ? (from + 1) % photos.length
        : (from - 1 + photos.length) % photos.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIndex(to);
      return;
    }
    moving.current = true;
    setIndex(to);
    setSlide({
      direction,
      from: photos[from] ?? "",
      to: photos[to] ?? "",
    });
  }

  function finishSlide(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }
    moving.current = false;
    setSlide(null);
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
        {photo ? (
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
              {slide ? (
                <div
                  onAnimationEnd={finishSlide}
                  className={`flex h-full w-[200%] ${
                    slide.direction === 1
                      ? "gallery-slide-next"
                      : "gallery-slide-prev"
                  }`}
                >
                  <PhotoSlot
                    src={slide.direction === 1 ? slide.from : slide.to}
                    alt=""
                    sizes="430px"
                    bare
                    instant
                    className="h-full w-1/2 shrink-0 grow-0 basis-1/2"
                  />
                  <PhotoSlot
                    src={slide.direction === 1 ? slide.to : slide.from}
                    alt={`Gallery photo ${index + 1}`}
                    sizes="430px"
                    bare
                    instant
                    className="h-full w-1/2 shrink-0 grow-0 basis-1/2"
                  />
                </div>
              ) : (
                <PhotoSlot
                  src={photo}
                  alt={`Gallery photo ${index + 1}`}
                  sizes="430px"
                  bare
                  instant
                  className="h-full w-full"
                />
              )}
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
                <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-3 py-1 text-[10px] tracking-wider text-muted">
                  {index + 1} / {photos.length}
                </p>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </InvitationSection>
  );
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
