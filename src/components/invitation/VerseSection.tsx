import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { InviteCopy } from "@/lib/site-settings";

export function VerseSection({ verse }: { verse: InviteCopy["verse"] }) {
  return (
    <InvitationSection section="verse" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        {verse.label}
      </p>
      <p className="font-display mt-6 max-w-xs text-3xl leading-snug text-white">
        {verse.text}
      </p>
      <p className="mt-5 text-sm text-white">{verse.source}</p>
    </InvitationSection>
  );
}
