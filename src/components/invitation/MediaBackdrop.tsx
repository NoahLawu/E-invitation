"use client";

import Image from "next/image";
import { useState } from "react";
import { useInviteVisuals } from "@/components/invitation/InviteVisualsContext";

type MediaBackdropProps = {
  image?: string;
  video?: string;
  alt: string;
  priority?: boolean;
};

export function SharedSectionVideo({ src }: { src: string }) {
  return (
    <div className="pointer-events-none sticky top-0 -mb-[100dvh] h-dvh w-full">
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
          className="object-cover"
          onError={() => setImageFailed(true)}
          {...(priority ? { priority: true } : { loading: "eager" as const })}
        />
      ) : null}
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={video}
          autoPlay
          muted
          loop
          playsInline
          poster={showImage ? image : undefined}
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      <BackdropTint />
    </div>
  );
}
