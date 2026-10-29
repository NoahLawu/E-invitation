"use client";

import Image from "next/image";
import { useState } from "react";
import { useInviteVisuals } from "@/components/invitation/InviteVisualsContext";

type MediaBackdropProps = {
  image?: string;
  video?: string;
  alt: string;
  priority?: boolean;
  veil?: "tint" | "bottom";
};

export function SharedSectionVideo({ src }: { src: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <video
        className="h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
      />
      <BackdropTint />
    </div>
  );
}

function BackdropTint() {
  const tint = useInviteVisuals()?.backdropTint ?? 0.45;
  return (
    <div
      className="absolute inset-0 bg-background"
      style={{ opacity: tint }}
    />
  );
}

export function MediaBackdrop({
  image,
  video,
  alt,
  priority = false,
  veil = "tint",
}: MediaBackdropProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;
  const showVideo = Boolean(video) && !videoFailed;

  if (!showImage && !showVideo) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {showImage ? (
        <Image
          src={image ?? ""}
          alt={alt}
          fill
          sizes="430px"
          className={
            veil === "bottom" ? "object-cover object-top" : "object-cover"
          }
          onError={() => setImageFailed(true)}
          {...(priority ? { priority: true } : { loading: "eager" as const })}
        />
      ) : null}
      {showVideo ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover ${
            veil === "bottom" ? "object-top" : ""
          }`}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          poster={showImage ? image : undefined}
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      {veil === "bottom" ? (
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-background/75 to-transparent" />
      ) : (
        <BackdropTint />
      )}
    </div>
  );
}
