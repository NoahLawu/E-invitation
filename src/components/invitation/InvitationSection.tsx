"use client";

import type { ReactNode } from "react";
import { MediaBackdrop } from "@/components/invitation/MediaBackdrop";
import { useInviteVisuals } from "@/components/invitation/InviteVisualsContext";
import type { InviteSectionId } from "@/lib/site-settings";

type InvitationSectionProps = {
  children: ReactNode;
  section?: InviteSectionId;
  image?: string;
  video?: string;
  mediaAlt?: string;
  priority?: boolean;
  contentAlign?: "center" | "bottom-left" | "top-left";
  veil?: "tint" | "bottom";
  cropBottom?: boolean;
};

export function InvitationSection({
  children,
  section,
  image,
  video,
  mediaAlt = "",
  priority = false,
  contentAlign = "center",
  veil = "tint",
  cropBottom = false,
}: InvitationSectionProps) {
  const visuals = useInviteVisuals();
  const backdrop = section ? visuals?.backdrops[section] : undefined;

  return (
    <section className="relative flex h-dvh w-full shrink-0 flex-col items-center overflow-hidden">
      <MediaBackdrop
        image={image ?? backdrop?.image}
        video={video ?? backdrop?.video}
        alt={mediaAlt}
        priority={priority}
        veil={veil}
        cropBottom={cropBottom}
      />
      <div
        className={`relative z-10 flex h-full w-full flex-col px-8 ${
          contentAlign === "bottom-left"
            ? "items-start justify-end pb-16 text-left"
            : contentAlign === "top-left"
              ? "items-start justify-start overflow-y-auto pt-14 pb-10 text-left"
              : "items-center justify-center text-center"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
