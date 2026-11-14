"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import { PhotoSlot } from "@/components/invitation/PhotoSlot";

function nearestSlide(frame: HTMLElement) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < frame.children.length; i++) {
    const child = frame.children[i] as HTMLElement;
    const dist = Math.abs(frame.scrollLeft - child.offsetLeft);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export function GallerySection({ photos }: { photos: string[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);
  const placed = useRef(false);
  const [index, setIndex] = useState(0);
  const looping = photos.length > 1;
  const slides = looping
    ? [photos[photos.length - 1], ...photos, photos[0]]
    : photos;

  function realIndex(scrollIndex: number) {
    if (!looping) {
      return 0;
    }
    if (scrollIndex <= 0) {
      return photos.length - 1;
    }
    if (scrollIndex >= photos.length + 1) {
      return 0;
    }
    return scrollIndex - 1;
  }

  useLayoutEffect(() => {
    const frame = scroller.current;
    if (!frame) {
      return;
    }
    placed.current = false;
    const place = () => {
      const width = frame.clientWidth;
      if (width === 0) {
        return;
      }
      for (const child of frame.children) {
        const slide = child as HTMLElement;
        slide.style.flexBasis = `${width}px`;
        slide.style.width = `${width}px`;
      }
      if (!looping || placed.current) {
        const current = nearestSlide(frame);
        const target = frame.children[current] as HTMLElement | undefined;
        if (target) {
          frame.scrollLeft = target.offsetLeft;
        }
        return;
      }
      const first = frame.children[1] as HTMLElement | undefined;
      frame.scrollLeft = first?.offsetLeft ?? width;
      placed.current = true;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [looping, photos]);

  function show(direction: -1 | 1) {
    const frame = scroller.current;
    if (!frame || frame.clientWidth === 0) {
      return;
    }
    const next = frame.children[nearestSlide(frame) + direction] as
      | HTMLElement
      | undefined;
    if (!next) {
      return;
    }
    frame.scrollTo({ left: next.offsetLeft, behavior: "smooth" });
  }

  function onScroll() {
    const frame = scroller.current;
    if (!frame || frame.clientWidth === 0) {
      return;
    }
    setIndex(realIndex(nearestSlide(frame)));
  }

  function onScrollEnd() {
    const frame = scroller.current;
    if (!frame || !looping || frame.clientWidth === 0) {
      return;
    }
    const scrollIndex = nearestSlide(frame);
    const jump =
      scrollIndex === 0
        ? (frame.children[photos.length] as HTMLElement | undefined)
        : scrollIndex === photos.length + 1
          ? (frame.children[1] as HTMLElement | undefined)
          : (frame.children[scrollIndex] as HTMLElement | undefined);
    if (jump && Math.abs(frame.scrollLeft - jump.offsetLeft) > 1) {
      frame.scrollTo({ left: jump.offsetLeft, behavior: "instant" });
    }
  }

  return (
    <InvitationSection section="gallery">
      <div
        ref={copyRef}
        className={`flex w-full flex-col items-center ${fade.className}`}
        style={fade.style}
      >
      <p className="text-xs tracking-[0.3em] text-white uppercase">Gallery</p>
      {photos.length === 0 ? null : (
        <div className="relative mt-6 w-full">
          <div
            ref={scroller}
            onScroll={onScroll}
            onScrollEnd={onScrollEnd}
            data-pager-allow=""
            className="flex h-[58dvh] w-full snap-x snap-mandatory touch-pan-x overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((src, slideIndex) => (
              <div
                key={`${src}-${slideIndex}`}
                className="relative h-full w-full shrink-0 grow-0 snap-start"
              >
                <PhotoSlot
                  src={src}
                  alt={`Gallery photo ${realIndex(slideIndex) + 1}`}
                  sizes="430px"
                  bare
                  className="h-full"
                />
              </div>
            ))}
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
      )}
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
