import { InvitationSection } from "@/components/invitation/InvitationSection";

type Person = {
  role: string;
  name: string;
  fullName: string;
  parents: string;
};

export function BrideDetailSection({ person }: { person: Person }) {
  return <PersonDetailSection person={person} section="bride" />;
}

export function GroomDetailSection({ person }: { person: Person }) {
  return <PersonDetailSection person={person} section="groom" />;
}

function PersonDetailSection({
  person,
  section,
}: {
  person: Person;
  section: "bride" | "groom";
}) {
  return (
    <InvitationSection
      section={section}
      mediaAlt={person.name}
      contentAlign="bottom-left"
      veil="bottom"
    >
      <p className="text-xs tracking-[0.3em] text-white/90 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        {person.role}
      </p>
      <h2 className="font-display mt-3 text-4xl text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
        {person.name}
      </h2>
      <p className="mt-2 text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        {person.fullName}
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        {person.parents}
      </p>
    </InvitationSection>
  );
}
