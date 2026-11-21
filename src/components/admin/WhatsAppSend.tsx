"use client";

import { useRouter } from "next/navigation";
import { setInviteSent } from "@/app/admin/actions";
import {
  fillWhatsAppTemplate,
  whatsAppTemplateForGuest,
  type WhatsAppTemplate,
} from "@/lib/site-settings";
import { toWhatsAppPhone, whatsappSendUrl } from "@/lib/whatsapp";
import type { Guest } from "@/lib/types";

type WhatsAppSendProps = {
  guest: Guest;
  inviteUrl: string;
  templates: WhatsAppTemplate[];
  label?: string;
};

export function WhatsAppSend({
  guest,
  inviteUrl,
  templates,
  label = "WhatsApp",
}: WhatsAppSendProps) {
  const phone = toWhatsAppPhone(guest.phone);
  const router = useRouter();
  const template = whatsAppTemplateForGuest(templates, guest.guest_type);

  if (!phone || !template?.body.trim()) {
    return null;
  }

  const text = fillWhatsAppTemplate(template.body, guest, inviteUrl);
  const href = whatsappSendUrl(phone, text);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        void setInviteSent(guest.id, true).then(() => router.refresh());
      }}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}
