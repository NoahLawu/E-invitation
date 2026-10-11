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
  const [imageReady, setImageReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  if (!image && !video) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="430px"
          className={`object-cover ${imageReady ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(false)}
          priority={priority}
        />
      ) : null}
      {video ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          poster={imageReady ? image : undefined}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
      ) : null}
      {imageReady || videoReady ? <BackdropTint /> : null}
    </div>
  );
}
