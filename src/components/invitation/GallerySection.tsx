"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { PhotoSlot } from "@/components/invitation/PhotoSlot";

export function GallerySection({ photos }: { photos: string[] }) {
  const scroller = useRef<HTMLDivElement>(null);
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
    if (!frame || !looping) {
      return;
    }
    placed.current = false;
    const place = () => {
      if (placed.current || frame.clientWidth === 0) {
        return;
      }
      frame.scrollLeft = frame.clientWidth;
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
    const current = Math.round(frame.scrollLeft / frame.clientWidth);
    frame.scrollTo({
      left: frame.clientWidth * (current + direction),
      behavior: "smooth",
    });
  }

  function onScroll() {
    const frame = scroller.current;
    if (!frame || frame.clientWidth === 0) {
      return;
    }
    const scrollIndex = Math.round(frame.scrollLeft / frame.clientWidth);
    setIndex(realIndex(scrollIndex));
  }

  function onScrollEnd() {
    const frame = scroller.current;
    if (!frame || !looping || frame.clientWidth === 0) {
      return;
    }
    const scrollIndex = Math.round(frame.scrollLeft / frame.clientWidth);
    if (scrollIndex === 0) {
      frame.scrollTo({ left: frame.clientWidth * photos.length, behavior: "instant" });
    } else if (scrollIndex === photos.length + 1) {
      frame.scrollTo({ left: frame.clientWidth, behavior: "instant" });
    }
  }

  return (
    <InvitationSection section="gallery">
      <p className="text-xs tracking-[0.3em] text-muted uppercase">Gallery</p>
      {photos.length === 0 ? null : (
        <div className="relative mt-6 w-full">
          <div
            ref={scroller}
            onScroll={onScroll}
            onScrollEnd={onScrollEnd}
            className="flex h-[58dvh] w-full snap-x snap-mandatory overflow-x-auto rounded-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((src, slideIndex) => (
              <div
                key={`${src}-${slideIndex}`}
                className="relative h-full w-full shrink-0 snap-center"
              >
                <PhotoSlot
                  src={src}
                  alt={`Gallery photo ${realIndex(slideIndex) + 1}`}
                  sizes="430px"
                  className="h-full rounded-xl"
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
                className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card text-lg"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => show(1)}
                className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card text-lg"
              >
                ›
              </button>
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-3 py-1 text-[10px] tracking-wider text-muted">
                {index + 1} / {photos.length}
              </p>
            </>
          ) : null}
        </div>
      )}
    </InvitationSection>
  );
}
