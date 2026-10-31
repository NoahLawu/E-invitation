"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const SWIPE_PX = 48;
const MOVE_MS = 320;

type SectionPagerProps = {
  enabled: boolean;
  background?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function SectionPager({
  enabled,
  background,
  className,
  children,
}: SectionPagerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const dragRef = useRef(0);
  const draggingRef = useRef(false);
  const axisRef = useRef<"x" | "y" | null>(null);
  const startRef = useRef<{ x: number; y: number; pointerId: number } | null>(
    null,
  );
  const wheelLockRef = useRef(0);
  const originYRef = useRef(0);

  function readY(track: HTMLElement) {
    const transform = getComputedStyle(track).transform;
    if (!transform || transform === "none") {
      return 0;
    }
    return new DOMMatrix(transform).m42;
  }

  function writeY(track: HTMLElement, y: number, animate: boolean) {
    track.style.transition = animate
      ? `transform ${MOVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : "none";
    track.style.transform = `translate3d(0, ${y}px, 0)`;
  }

  function paint(animate: boolean) {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) {
      return;
    }
    const y = -indexRef.current * root.clientHeight + dragRef.current;
    writeY(track, y, animate);
  }

  function settle(direction: -1 | 1 | 0) {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) {
      return;
    }
    if (direction !== 0) {
      const max = Math.max(0, track.children.length - 1);
      indexRef.current = Math.min(
        max,
        Math.max(0, indexRef.current + direction),
      );
    }
    dragRef.current = 0;
    const y = -indexRef.current * root.clientHeight;
    const from = readY(track);
    writeY(track, from, false);
    void track.offsetHeight;
    writeY(track, y, true);
  }

  useEffect(() => {
    paint(false);
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const observer = new ResizeObserver(() => {
      if (!draggingRef.current) {
        paint(false);
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    function onWheel(event: WheelEvent) {
      if (!enabled || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }
      if (Math.abs(event.deltaY) < 12) {
        return;
      }
      const now = performance.now();
      if (now < wheelLockRef.current) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      wheelLockRef.current = now + MOVE_MS;
      settle(event.deltaY > 0 ? 1 : -1);
    }
    function onTouchMove(event: TouchEvent) {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-pager-allow], textarea, input, select")
      ) {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
    }
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchmove", onTouchMove);
    };
  }, [enabled]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!enabled || event.button !== 0) {
      return;
    }
    const track = trackRef.current;
    if (track) {
      const y = readY(track);
      originYRef.current = y;
      writeY(track, y, false);
    }
    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    axisRef.current = null;
    draggingRef.current = true;
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!axisRef.current && Math.hypot(dx, dy) > 8) {
      axisRef.current = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
      if (axisRef.current === "y") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (axisRef.current !== "y") {
      return;
    }
    const track = trackRef.current;
    if (!track) {
      return;
    }
    dragRef.current = dy;
    writeY(track, originYRef.current + dy, false);
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const vertical = axisRef.current === "y";
    startRef.current = null;
    axisRef.current = null;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!vertical || Math.abs(dy) < SWIPE_PX || Math.abs(dy) < Math.abs(dx)) {
      settle(0);
      return;
    }
    settle(dy < 0 ? 1 : -1);
  }

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden overscroll-none touch-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {background}
      <div
        ref={trackRef}
        className="relative z-10 will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
