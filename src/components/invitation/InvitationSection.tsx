"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  contentAlign?: "center" | "bottom-left";
};

export function InvitationSection({
  children,
  section,
  image,
  video,
  mediaAlt = "",
  priority = false,
  contentAlign = "center",
}: InvitationSectionProps) {
  const visuals = useInviteVisuals();
  const backdrop = section ? visuals?.backdrops[section] : undefined;
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(priority);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const root = node.closest(".invitation-snap");
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (!entry.isIntersecting) return;
        node.querySelectorAll("img").forEach((img) => {
          void img.decode().catch(() => {});
        });
      },
      {
        root: root instanceof Element ? root : null,
        rootMargin: "100% 0px",
        threshold: 0,
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-dvh w-full shrink-0 snap-start snap-always"
    >
      <div
        className={`relative flex h-full w-full flex-col items-center overflow-hidden ${
          near ? "[transform:translateZ(0)]" : ""
        }`}
      >
        <MediaBackdrop
          image={image ?? backdrop?.image}
          video={video ?? backdrop?.video}
          alt={mediaAlt}
          priority={priority}
        />
        <div
          className={`relative z-10 flex h-full w-full flex-col px-8 ${
            contentAlign === "bottom-left"
              ? "items-start justify-end pb-16 text-left"
              : "items-center justify-center text-center"
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
