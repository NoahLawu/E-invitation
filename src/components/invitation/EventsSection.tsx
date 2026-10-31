import { InvitationSection } from "@/components/invitation/InvitationSection";
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
  return (
    <InvitationSection section="events" mediaAlt="" contentAlign="top-left">
      <p className="font-display text-[1.40625rem] leading-tight text-white">
        Join us in celebrating
      </p>
      <div className="mt-6 w-full text-white">
        {visible.map((event, index) => (
          <article
            key={event.id}
            className={
              index > 0 ? "mt-6 border-t-2 border-white/70 pt-6" : undefined
            }
          >
            <h2 className="font-display text-[1.6875rem] leading-tight">{event.title}</h2>
            {eventDateLabel(event.date) ? (
              <p className="font-display mt-3 text-[0.9375rem] leading-snug">
                {eventDateLabel(event.date)}
              </p>
            ) : null}
            {eventTimeLabel(event.time) ? (
              <p className="font-display text-[0.9375rem] leading-snug">
                {eventTimeLabel(event.time)}
              </p>
            ) : null}
            {event.place ? (
              <p className="font-display mt-4 text-[0.9375rem] leading-snug whitespace-pre-line">
                {event.place}
              </p>
            ) : null}
            {event.address ? (
              <p className="mt-2 text-[0.65625rem] leading-relaxed whitespace-pre-line text-white/90">
                {event.address}
              </p>
            ) : null}
            {event.mapsUrl || event.wazeUrl ? (
              <div className="mt-5 flex flex-wrap gap-2">
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
        ))}
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
  const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return time.trim() || null;
  }
  const clock = new Date();
  clock.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return clock.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
