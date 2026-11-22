"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

type PhotoSlotProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  bare?: boolean;
  instant?: boolean;
  style?: CSSProperties;
};

export function PhotoSlot({
  src,
  alt,
  className = "",
  sizes = "200px",
  bare = false,
  instant = false,
  style,
}: PhotoSlotProps) {
  const [ready, setReady] = useState(instant);

  const frame = bare ? "" : "border border-line bg-card";

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden ${frame} ${className}`}
        style={style}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${frame} ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${ready ? "opacity-100" : "opacity-0"}`}
        priority={instant}
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </div>
  );
}
