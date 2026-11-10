"use client";

import { useEffect, useRef, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { InviteCopy } from "@/lib/site-settings";

export function VerseSection({ verse }: { verse: InviteCopy["verse"] }) {
  const copyRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = copyRef.current;
    const frame = node?.closest("section");
    if (!frame) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        setShown((current) => {
          if (ratio >= 0.72) {
            return true;
          }
          if (ratio <= 0.05) {
            return false;
          }
          return current;
        });
      },
      { threshold: [0, 0.05, 0.72, 1] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <InvitationSection section="verse" mediaAlt="">
      <div
        ref={copyRef}
        className={`person-text-fade ${shown ? "is-shown" : ""}`}
      >
        <p className="text-xs tracking-[0.3em] text-white uppercase">
          {verse.label}
        </p>
        {verse.arabic ? (
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic mt-6 w-full max-w-sm text-2xl leading-loose whitespace-pre-line text-white"
          >
            {verse.arabic}
          </p>
        ) : null}
        {verse.text ? (
          <p className="font-display mt-5 w-full max-w-sm text-lg leading-relaxed whitespace-pre-line text-white">
            {verse.text}
          </p>
        ) : null}
        {verse.source ? (
          <p className="mt-5 text-sm text-white">{verse.source}</p>
        ) : null}
      </div>
    </InvitationSection>
  );
}
