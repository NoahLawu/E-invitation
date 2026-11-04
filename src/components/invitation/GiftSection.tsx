"use client";

import { useEffect, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { BankAccount } from "@/lib/site-settings";

const LOGO_HEIGHT = 36;
const BANK_ORDER = ["BCA", "BNI"];

function giftTitle(title: string) {
  if (title.includes("\n")) {
    return title;
  }
  return title.replace(/\s+(Means\s+Everything)\s*$/i, "\n$1");
}

function orderedAccounts(accounts: BankAccount[]) {
  const rank = (bank: string) => {
    const index = BANK_ORDER.indexOf(bank.trim().toUpperCase());
    return index === -1 ? BANK_ORDER.length : index;
  };

  return accounts
    .map((account, index) => ({ account, index }))
    .sort((left, right) => {
      const byBank = rank(left.account.bank) - rank(right.account.bank);
      return byBank === 0 ? left.index - right.index : byBank;
    })
    .map((item) => item.account);
}

export function GiftSection({
  accounts,
  title,
  note,
}: {
  accounts: BankAccount[];
  title: string;
  note: string;
}) {
  return (
    <InvitationSection section="gifts" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        Wedding gift
      </p>
      {title.trim() ? (
        <h2 className="font-display mt-3 max-w-xs text-3xl whitespace-pre-line text-white">
          {giftTitle(title)}
        </h2>
      ) : null}
      {note.trim() ? (
        <p className="mt-2 max-w-xs text-sm whitespace-pre-line text-white">
          {note}
        </p>
      ) : null}
      <div className="mt-4 w-full space-y-2">
        {orderedAccounts(accounts).map((account) => (
          <BankCard
            key={`${account.bank}-${account.number}`}
            account={account}
          />
        ))}
      </div>
    </InvitationSection>
  );
}

function BankLogo({ src }: { src: string }) {
  const [box, setBox] = useState<{
    imgWidth: number;
    imgHeight: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      if (!naturalWidth || !naturalHeight) {
        return;
      }
      const sample = Math.max(
        1,
        Math.floor(Math.max(naturalWidth, naturalHeight) / 480),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(naturalWidth / sample);
      canvas.height = Math.ceil(naturalHeight / sample);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let pixels: Uint8ClampedArray;
      try {
        pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      } catch {
        return;
      }
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          if (pixels[(y * canvas.width + x) * 4 + 3] <= 16) {
            continue;
          }
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (cancelled || maxX <= minX || maxY <= minY) {
        return;
      }
      const contentHeight = (maxY - minY + 1) / canvas.height;
      const contentWidth = (maxX - minX + 1) / canvas.width;
      const imgHeight = LOGO_HEIGHT / contentHeight;
      const imgWidth = imgHeight * (naturalWidth / naturalHeight);
      setBox({
        imgWidth,
        imgHeight,
        left: (minX / canvas.width) * imgWidth,
        top: (minY / canvas.height) * imgHeight,
        width: contentWidth * imgWidth,
        height: LOGO_HEIGHT,
      });
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden"
      style={{
        height: box?.height ?? LOGO_HEIGHT,
        width: box?.width ?? LOGO_HEIGHT,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={box ? "absolute max-w-none" : "h-9 w-auto opacity-0"}
        style={
          box
            ? {
                width: box.imgWidth,
                height: box.imgHeight,
                left: -box.left,
                top: -box.top,
              }
            : undefined
        }
      />
    </span>
  );
}

function BankCard({ account }: { account: BankAccount }) {
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(account.number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-card/90 px-3 py-2.5 text-left">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">
        {account.bank}
      </p>
      <p className="mt-0.5 text-sm text-foreground">{account.holder}</p>
      {account.logo ? (
        <div className="mt-2">
          <BankLogo src={account.logo} />
        </div>
      ) : null}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 font-mono text-sm tracking-wide">{account.number}</p>
        <button
          type="button"
          onClick={copyNumber}
          className="min-h-9 shrink-0 rounded-full bg-accent px-3 text-xs tracking-wide text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </article>
  );
}
