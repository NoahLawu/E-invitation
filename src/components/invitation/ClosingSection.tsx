"use client";

import { useRef } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";

export function ClosingSection() {
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);

  return (
    <InvitationSection section="closing" mediaAlt="">
      <div
        ref={copyRef}
        className={`flex w-full flex-col items-center ${fade.className}`}
        style={fade.style}
      >
        <h2 className="font-display text-4xl text-white">Thank you</h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white">
          We look forward to celebrating with you.
        </p>
      </div>
    </InvitationSection>
  );
}
