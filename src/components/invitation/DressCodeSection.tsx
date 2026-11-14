"use client";

import { useRef } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import type { SiteSettings } from "@/lib/site-settings";

export function DressCodeSection({
  dressCode,
  tint,
}: {
  dressCode: SiteSettings["dressCode"];
  tint: number;
}) {
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);
  const content = (
    <>
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        Dress code
      </p>
      <h2 className="font-display mt-3 text-3xl text-white">{dressCode.label}</h2>
      <p className="mt-2 text-sm text-white">{dressCode.note}</p>
      <div className="mt-8 flex justify-center gap-4">
        {dressCode.colors.map((color) => (
          <div
            key={`${color.name}-${color.hex}`}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="h-12 w-12 rounded-full border border-line"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <span className="text-[10px] tracking-wide text-white uppercase">
              {color.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <InvitationSection section="dressCode" mediaAlt="">
      <div
        ref={copyRef}
        className={`flex w-full flex-col items-center ${fade.className}`}
        style={fade.style}
      >
      {dressCode.image ? (
        <div className="relative max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dressCode.image}
            alt=""
            className="block h-auto max-h-[84dvh] w-auto max-w-full border-0"
          />
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: tint }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-10">
            {content}
          </div>
        </div>
      ) : (
        content
      )}
      </div>
    </InvitationSection>
  );
}
