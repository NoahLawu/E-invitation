import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { InviteCopy } from "@/lib/site-settings";

export function VerseSection({ verse }: { verse: InviteCopy["verse"] }) {
  return (
    <InvitationSection section="verse" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        {verse.label}
      </p>
      {verse.arabic ? (
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic mt-6 w-full max-w-sm text-2xl leading-loose whitespace-pre-line text-white"
        >
          {verse.arabic}
        </p>
      ) : null}
      {verse.text ? (
        <p className="font-display mt-5 w-full max-w-sm text-lg leading-relaxed whitespace-pre-line text-white">
          {verse.text}
        </p>
      ) : null}
      {verse.source ? (
        <p className="mt-5 text-sm text-white">{verse.source}</p>
      ) : null}
    </InvitationSection>
  );
}
