import Image from "next/image";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { SiteSettings } from "@/lib/site-settings";

export function DressCodeSection({
  dressCode,
  tint,
}: {
  dressCode: SiteSettings["dressCode"];
  tint: number;
}) {
  const content = (
    <>
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        Dress code
      </p>
      <h2 className="font-display mt-3 text-3xl">{dressCode.label}</h2>
      <p className="mt-2 text-sm text-muted">{dressCode.note}</p>
      <div className="mt-8 flex justify-center gap-4">
        {dressCode.colors.map((color) => (
          <div
            key={`${color.name}-${color.hex}`}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="h-12 w-12 rounded-full border border-line"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <span className="text-[10px] tracking-wide text-muted uppercase">
              {color.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <InvitationSection section="dressCode" mediaAlt="">
      {dressCode.image ? (
        <div className="relative w-full overflow-hidden rounded-2xl">
          <Image
            src={dressCode.image}
            alt=""
            fill
            sizes="430px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: tint }}
          />
          <div className="relative z-10 flex min-h-[52dvh] flex-col items-center justify-center px-4 py-10">
            {content}
          </div>
        </div>
      ) : (
        content
      )}
    </InvitationSection>
  );
}
