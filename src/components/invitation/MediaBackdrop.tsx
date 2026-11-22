"use client";

import Image from "next/image";
import { useState, type RefObject } from "react";
import { useInviteVisuals } from "@/components/invitation/InviteVisualsContext";

type MediaBackdropProps = {
  image?: string;
  video?: string;
  alt: string;
  priority?: boolean;
  veil?: "tint" | "bottom";
  cropBottom?: boolean;
  clipBottom?: boolean;
};

export function SharedSectionVideo({
  src,
  mediaRef,
}: {
  src: string;
  mediaRef: RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <video
        ref={mediaRef}
        className="h-full w-full object-cover"
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
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
  cropBottom = false,
  clipBottom = false,
}: MediaBackdropProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;
  const showVideo = Boolean(video) && !videoFailed;
  const frame = cropBottom
    ? "origin-top scale-[1.1] object-cover object-top"
    : "h-full w-full object-cover object-center";

  if (!showImage && !showVideo) {
    return null;
  }

  return (
    <div className={clipBottom ? "absolute inset-x-0 top-0 h-[122%]" : "absolute inset-0"}>
      {showImage ? (
        <Image
          src={image ?? ""}
          alt={alt}
          fill
          sizes="430px"
          quality={veil === "bottom" ? 95 : 75}
          unoptimized={veil === "bottom"}
          className={clipBottom ? "object-cover object-top" : frame}
          fetchPriority={priority || veil === "bottom" ? "high" : "auto"}
          onError={() => setImageFailed(true)}
          {...(priority || veil === "bottom"
            ? { priority: true }
            : { loading: "eager" as const })}
        />
      ) : null}
      {showVideo ? (
        <video
          className={`absolute inset-0 h-full w-full ${frame}`}
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
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/70 to-transparent" />
      ) : (
        <BackdropTint />
      )}
    </div>
  );
}
