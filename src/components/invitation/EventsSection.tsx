"use client";

import { useRef } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import { eventsForInvite, type InviteEventDetails } from "@/lib/site-settings";
import type { InviteEvent } from "@/lib/types";

export function EventsSection({
  invitedTo = "both",
  events,
}: {
  invitedTo?: InviteEvent;
  events: InviteEventDetails[];
}) {
  const visible = eventsForInvite(events, invitedTo);
  const copyRef = useRef<HTMLDivElement>(null);
  const shown = useSectionShown(copyRef);
  let step = 0;
  function fade() {
    return lineFade(shown, step++);
  }
  const intro = fade();

  return (
    <InvitationSection section="events" mediaAlt="" contentAlign="top-left">
      <div ref={copyRef} className="w-full">
      <p
        className={`font-display text-[1.40625rem] leading-tight text-white ${intro.className}`}
        style={intro.style}
      >
        Join us in celebrating
      </p>
      <div className="mt-6 w-full text-white">
        {visible.map((event, index) => {
          const title = fade();
          const date = eventDateLabel(event.date) ? fade() : null;
          const time = eventTimeLabel(event.time) ? fade() : null;
          const place = event.place ? fade() : null;
          const address = event.address ? fade() : null;
          const links = event.mapsUrl || event.wazeUrl ? fade() : null;
          return (
          <article
            key={event.id}
            className={
              index > 0 ? "mt-6 border-t-2 border-white/70 pt-6" : undefined
            }
          >
            <h2
              className={`font-display text-[1.6875rem] leading-tight ${title.className}`}
              style={title.style}
            >
              {event.title}
            </h2>
            {date ? (
              <p
                className={`font-display mt-3 text-[0.9375rem] leading-snug ${date.className}`}
                style={date.style}
              >
                {eventDateLabel(event.date)}
              </p>
            ) : null}
            {time ? (
              <p
                className={`font-display text-[0.9375rem] leading-snug ${time.className}`}
                style={time.style}
              >
                {eventTimeLabel(event.time)}
              </p>
            ) : null}
            {place ? (
              <p
                className={`font-display mt-4 text-[0.9375rem] leading-snug whitespace-pre-line ${place.className}`}
                style={place.style}
              >
                {event.place}
              </p>
            ) : null}
            {address ? (
              <p
                className={`mt-2 text-[0.65625rem] leading-relaxed whitespace-pre-line text-white/90 ${address.className}`}
                style={address.style}
              >
                {event.address}
              </p>
            ) : null}
            {links ? (
              <div
                className={`mt-5 flex flex-wrap gap-2 ${links.className}`}
                style={links.style}
              >
                {event.mapsUrl ? (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center bg-white/80 px-4 text-[0.65625rem] text-foreground"
                  >
                    Google Maps
                  </a>
                ) : null}
                {event.wazeUrl ? (
                  <a
                    href={event.wazeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center bg-white/80 px-4 text-[0.65625rem] text-foreground"
                  >
                    Waze
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
          );
        })}
      </div>
      </div>
    </InvitationSection>
  );
}

function eventDateLabel(date: string) {
  if (!date) {
    return null;
  }
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function eventTimeLabel(time: string) {
  const trimmed = time.trim();
  if (!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(trimmed)) {
    return trimmed || null;
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return trimmed || null;
  }
  const clock = new Date();
  clock.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return clock.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
