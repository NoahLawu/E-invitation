"use client";

import { useRef, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { PhotoSlot } from "@/components/invitation/PhotoSlot";
import type { InviteCopy } from "@/lib/site-settings";

export function LoveStorySection({
  beats,
  photos,
}: {
  beats: InviteCopy["loveStory"];
  photos: string[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = beats.length;

  function onScroll() {
    const frame = scroller.current;
    if (!frame || frame.clientWidth === 0) {
      return;
    }
    const next = Math.round(frame.scrollLeft / frame.clientWidth);
    setIndex(Math.min(total - 1, Math.max(0, next)));
  }

  return (
    <InvitationSection section="loveStory" mediaAlt="">
      <div className="flex h-full w-full flex-col items-center">
        <p className="text-xs tracking-[0.3em] text-white uppercase">
          Our story
        </p>
        <div
          ref={scroller}
          onScroll={onScroll}
          data-pager-allow=""
          className="mt-4 flex w-full flex-1 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {beats.map((beat, beatIndex) => {
            const photo = photos[beatIndex] ?? "";
            const heading = beat.title.trim() || beat.year;
            return (
              <article
                key={`${beat.year}-${beat.title}-${beatIndex}`}
                className="flex h-full w-full shrink-0 snap-center flex-col items-center justify-center px-2"
              >
                {heading ? (
                  <h2 className="font-display max-w-xs text-center text-4xl leading-tight text-white">
                    {heading}
                  </h2>
                ) : null}
                {beat.title.trim() && beat.year.trim() ? (
                  <p className="font-display mt-2 text-2xl text-white">
                    {beat.year}
                  </p>
                ) : null}
                {photo ? (
                  <div className="relative mt-5 aspect-square w-[68%] max-w-[16rem]">
                    <PhotoSlot
                      src={photo}
                      alt={heading || "Our story"}
                      sizes="256px"
                      className="h-full w-full"
                    />
                  </div>
                ) : null}
                {beat.text.trim() ? (
                  <p className="mt-5 max-w-xs text-center text-sm leading-relaxed text-white">
                    {beat.text}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        {total > 0 ? (
          <p className="mt-4 text-sm tracking-[0.35em] text-white">
            {index + 1} / {total}
          </p>
        ) : null}
      </div>
    </InvitationSection>
  );
}
