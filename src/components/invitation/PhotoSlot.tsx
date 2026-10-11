"use client";

import Image from "next/image";
import { useState } from "react";

type PhotoSlotProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function PhotoSlot({
  src,
  alt,
  className = "",
  sizes = "200px",
}: PhotoSlotProps) {
  const [ready, setReady] = useState(false);

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden border border-line bg-card ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-line bg-card ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${ready ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </div>
  );
}
