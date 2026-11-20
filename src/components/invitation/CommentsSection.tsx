"use client";

import { FormEvent, useRef, useState } from "react";
import { submitComment } from "@/app/invite/actions";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import { lineFade, useSectionShown } from "@/components/invitation/line-fade";
import { useInviteBusy } from "@/components/invitation/InviteBusy";
import { useToast } from "@/components/ui/Toast";

type GuestComment = {
  id: string;
  name: string;
  message: string;
};

type CommentsSectionProps = {
  guestName: string;
  guestToken?: string;
  comments?: GuestComment[];
};

const sampleWishes: GuestComment[] = [
  {
    id: "sample-1",
    name: "Rina & Andi",
    message: "Congratulations Intan and Noah. Wishing you a lifetime of love.",
  },
  {
    id: "sample-2",
    name: "Budi Santoso",
    message: "So happy for both of you. See you at the reception.",
  },
  {
    id: "sample-3",
    name: "Sari Dewi",
    message: "May your home be full of laughter, patience, and warm meals.",
  },
  {
    id: "sample-4",
    name: "Kevin Tan",
    message: "What a beautiful day to celebrate the two of you.",
  },
  {
    id: "sample-5",
    name: "Maya Putri",
    message:
      "Intan, Noah — thank you for letting us be part of this. Love you both.",
  },
  {
    id: "sample-6",
    name: "Dimas Pratama",
    message: "Selamat menempuh hidup baru. Semoga selalu saling jaga.",
  },
  {
    id: "sample-7",
    name: "Auntie Lina",
    message: "You two look so happy. Blessings on your marriage.",
  },
  {
    id: "sample-8",
    name: "Hendra Wijaya",
    message: "Congratulations. Wishing you health, joy, and many adventures.",
  },
  {
    id: "sample-9",
    name: "Nadia Kusuma",
    message: "So glad I could celebrate with you today.",
  },
  {
    id: "sample-10",
    name: "The Hartono Family",
    message:
      "May Allah bless your union and keep your hearts close through every season.",
  },
  {
    id: "sample-11",
    name: "Clara Ong",
    message: "Cheers to Intan and Noah. This is going to be a lovely chapter.",
  },
  {
    id: "sample-12",
    name: "Fajar Rahman",
    message: "Happy wedding day. Cannot wait to dance later.",
  },
  {
    id: "sample-13",
    name: "Mrs. Susanti",
    message: "Anak-anak yang baik. Semoga rumah tangganya sakinah.",
  },
  {
    id: "sample-14",
    name: "Jason & Melissa",
    message: "We are so excited for you. Congratulations.",
  },
  {
    id: "sample-15",
    name: "Oki Pratama",
    message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair.",
  },
];

export function CommentsSection({
  guestName,
  guestToken,
  comments = [],
}: CommentsSectionProps) {
  const defaultName = guestName === "Guest" ? "" : guestName;
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([...comments, ...sampleWishes]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const toast = useToast();
  const setBusy = useInviteBusy();
  const copyRef = useRef<HTMLDivElement>(null);
  const fade = lineFade(useSectionShown(copyRef), 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    const nextMessage = message.trim();
    if (!nextName || !nextMessage) {
      return;
    }

    setError(null);
    setPending(true);
    setBusy(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await submitComment(formData);

      if (!result.ok) {
        const nextError = result.error ?? "Could not send wish.";
        setError(nextError);
        toast({ tone: "error", message: nextError });
        return;
      }

      setItems((current) => [
        { id: crypto.randomUUID(), name: nextName, message: nextMessage },
        ...current,
      ]);
      setMessage("");
      toast("Wish sent.");
    } finally {
      setPending(false);
      setBusy(false);
    }
  }

  return (
    <InvitationSection section="comments" mediaAlt="" contentAlign="top-left">
      <div
        ref={copyRef}
        className={`flex min-h-0 w-full flex-1 flex-col items-center text-center ${fade.className}`}
        style={fade.style}
      >
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        Guest book
      </p>
      <h2 className="font-display mt-3 text-3xl text-white">Leave a wish</h2>
      <form className="mt-4 w-full space-y-2 text-left" onSubmit={handleSubmit}>
        {guestToken ? (
          <input type="hidden" name="token" value={guestToken} />
        ) : null}
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="min-h-11 w-full rounded-xl border border-line bg-card/90 px-3 text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="sr-only">Message</span>
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Your message"
            rows={2}
            className="w-full resize-none touch-none rounded-xl border border-line bg-card/90 px-3 py-2 text-sm outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-full bg-accent text-sm tracking-wide text-white disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
      <ul
        data-pager-scroll
        className="wish-scroll mt-3 min-h-0 w-full flex-1 space-y-2 overflow-y-auto overscroll-contain pr-4 pb-16 text-left touch-pan-y"
      >
        {items.length === 0 ? (
          <li className="rounded-xl border border-line bg-card/80 px-3 py-3 text-center text-sm text-muted">
            Be the first to leave a wish.
          </li>
        ) : (
          items.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-line bg-card/90 px-3 py-3"
            >
              <p className="text-sm font-medium">{comment.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {comment.message}
              </p>
            </li>
          ))
        )}
      </ul>
      </div>
    </InvitationSection>
  );
}
