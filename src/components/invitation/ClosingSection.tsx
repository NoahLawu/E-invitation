import { InvitationSection } from "@/components/invitation/InvitationSection";

export function ClosingSection({
  brideName,
  groomName,
}: {
  brideName: string;
  groomName: string;
}) {
  return (
    <InvitationSection section="closing" mediaAlt="">
      <h2 className="font-display text-4xl text-white">Thank you</h2>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-white">
        {brideName} and {groomName} look forward to celebrating with you.
      </p>
    </InvitationSection>
  );
}
