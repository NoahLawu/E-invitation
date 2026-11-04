import { InvitationSection } from "@/components/invitation/InvitationSection";

type Person = {
  role: string;
  name: string;
  fullName: string;
  parents: string;
  instagram: string;
};

function instagramHandle(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
    );
    return (parsed.pathname.split("/").filter(Boolean)[0] ?? "").replace(
      /^@/,
      "",
    );
  } catch {
    return "";
  }
}

export function BrideDetailSection({ person }: { person: Person }) {
  return <PersonDetailSection person={person} section="bride" />;
}

export function GroomDetailSection({ person }: { person: Person }) {
  return <PersonDetailSection person={person} section="groom" />;
}

function InstagramLink({ url }: { url: string }) {
  const handle = instagramHandle(url);
  if (!handle) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-6 inline-flex items-center gap-2 text-white"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.8" r="0.8" className="fill-current stroke-none" />
      </svg>
      <span className="text-sm leading-none">{handle}</span>
    </a>
  );
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
        <InstagramLink url={person.instagram} />
      </div>
    </InvitationSection>
  );
}
