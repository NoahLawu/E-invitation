"use client";

import { useEffect, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { countdownTarget } from "@/lib/site-settings";

export function CountdownSection({ weddingAt }: { weddingAt: string }) {
  const remaining = useCountdown(weddingAt);

  return (
    <InvitationSection section="countdown" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-white/80 uppercase">Countdown</p>
      <div className="mt-8 grid w-full grid-cols-4 gap-2">
        <TimeBox value={remaining?.days ?? "--"} label="Days" />
        <TimeBox value={remaining?.hours ?? "--"} label="Hours" />
        <TimeBox value={remaining?.mins ?? "--"} label="Minutes" />
        <TimeBox value={remaining?.secs ?? "--"} label="Seconds" />
      </div>
    </InvitationSection>
  );
}

function useCountdown(weddingAt: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!weddingAt) {
      return;
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [weddingAt]);

  const target = countdownTarget(weddingAt);
  if (Number.isNaN(target)) {
    return null;
  }

  const diff = Math.max(0, target - now);
  return {
    days: String(Math.floor(diff / 86_400_000)),
    hours: String(Math.floor((diff / 3_600_000) % 24)).padStart(2, "0"),
    mins: String(Math.floor((diff / 60_000) % 60)).padStart(2, "0"),
    secs: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
  };
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-5xl leading-none font-light tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.28)]">
        {value}
      </p>
      <p className="mt-3 text-[11px] font-light tracking-[0.14em] text-white/80">
        {label}
      </p>
    </div>
  );
}
