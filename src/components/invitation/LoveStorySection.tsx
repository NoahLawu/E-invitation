"use client";

import { useRef, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
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
  const copyRef = useRef<HTMLDivElement>(null);
  const shown = useSectionShown(copyRef);
  const [index, setIndex] = useState(0);
  const total = beats.length;
  const pageFade = lineFade(shown, photos.some(Boolean) ? 4 : 3);

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
      <div
        ref={copyRef}
        className="flex h-full min-h-0 w-full flex-col items-center"
      >
        <p
          className={`mt-[3.5cm] text-xs tracking-[0.3em] text-white uppercase ${lineFade(shown, 0).className}`}
          style={lineFade(shown, 0).style}
        >
          Our story
        </p>
        <div
          ref={scroller}
          onScroll={onScroll}
          data-pager-allow=""
          className="mt-4 flex min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {beats.map((beat, beatIndex) => {
            const photo = photos[beatIndex] ?? "";
            const heading = beat.title.trim() || beat.year;
            let step = 1;
            const titleFade = heading ? lineFade(shown, step++) : null;
            const photoFade = photo ? lineFade(shown, step++) : null;
            const textFade = beat.text.trim() ? lineFade(shown, step++) : null;
            return (
              <article
                key={`${beat.year}-${beat.title}-${beatIndex}`}
                className="flex h-full min-h-0 w-full shrink-0 snap-center flex-col items-center overflow-y-auto px-2 pb-3 text-center [container-type:size] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {heading ? (
                  <h2
                    className={`shrink-0 font-display max-w-xs text-4xl leading-tight text-white ${titleFade?.className ?? ""}`}
                    style={titleFade?.style}
                  >
                    {heading}
                  </h2>
                ) : null}
                {photo ? (
                  <div
                    className={`relative mt-4 aspect-square w-[min(68%,16rem,40cqh)] shrink-0 ${photoFade?.className ?? ""}`}
                    style={photoFade?.style}
                  >
                    <PhotoSlot
                      src={photo}
                      alt={heading || "Our story"}
                      sizes="256px"
                      bare
                      className="h-full w-full"
                    />
                  </div>
                ) : null}
                {beat.text.trim() ? (
                  <p
                    className={`mt-4 max-w-xs shrink-0 font-display text-lg leading-snug text-white ${textFade?.className ?? ""}`}
                    style={textFade?.style}
                  >
                    {beat.text}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        {total > 0 ? (
          <p
            className={`mb-[3.5cm] font-display text-xl text-white ${pageFade.className}`}
            style={pageFade.style}
          >
            {index + 1} / {total}
          </p>
        ) : null}
      </div>
    </InvitationSection>
  );
}
