import { InvitationSection } from "@/components/invitation/InvitationSection";
import {
  eventsForInvite,
  type InviteEventDetails,
} from "@/lib/site-settings";
import type { InviteEvent } from "@/lib/types";

export function LocationSection({
  invitedTo = "both",
  events,
}: {
  invitedTo?: InviteEvent;
  events: InviteEventDetails[];
}) {
  const visible = eventsForInvite(events, invitedTo);
  return (
    <InvitationSection section="location" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-muted uppercase">Location</p>
      <div className="mt-6 w-full space-y-3">
        {visible.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border border-line bg-card/90 px-4 py-4"
          >
            <h2 className="font-display text-2xl">{event.title}</h2>
            <p className="mt-1 text-sm text-muted">{event.place}</p>
          </article>
        ))}
      </div>
    </InvitationSection>
  );
}
