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
      <p className="text-xs tracking-[0.3em] text-muted uppercase">
        {person.role}
      </p>
      <h2 className="font-display mt-3 text-4xl">{person.name}</h2>
      <p className="mt-2 text-sm text-foreground">{person.fullName}</p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
        {person.parents}
      </p>
    </InvitationSection>
  );
}
