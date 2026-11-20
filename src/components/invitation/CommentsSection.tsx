"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

export function CommentsSection({
  guestName,
  guestToken,
  comments = [],
}: CommentsSectionProps) {
  const defaultName = guestName === "Guest" ? "" : guestName;
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState(comments);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const toast = useToast();
  const setBusy = useInviteBusy();
  const copyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const fade = lineFade(useSectionShown(copyRef), 0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const measure = () => {
      setCanScroll(list.scrollHeight > list.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items]);

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
        ref={listRef}
        data-pager-scroll
        className={`wish-scroll mt-3 mb-14 min-h-0 w-full flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1.5 pb-2 text-left${canScroll ? " touch-pan-y" : ""}`}
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
