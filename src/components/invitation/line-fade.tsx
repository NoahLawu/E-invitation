"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";

export function useSectionShown(ref: RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const frame = node?.closest("section");
    if (!frame) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        setShown((current) => {
          if (ratio >= 0.72) {
            return true;
          }
          if (ratio <= 0.05) {
            return false;
          }
          return current;
        });
      },
      { threshold: [0, 0.05, 0.72, 1] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [ref]);

  return shown;
}

export function lineFade(shown: boolean, index: number) {
  return {
    className: shown ? "line-fade is-shown" : "line-fade",
    style: { "--fade-index": index } as CSSProperties,
  };
}
