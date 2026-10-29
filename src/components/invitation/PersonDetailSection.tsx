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
      <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.28)]">
        <p className="text-xs tracking-[0.3em] text-white/90 uppercase">
          {person.role}
        </p>
        <h2 className="font-display mt-3 text-4xl text-white">{person.name}</h2>
        <p className="mt-2 text-sm text-white">{person.fullName}</p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/90">
          {person.parents}
        </p>
      </div>
    </InvitationSection>
  );
}
