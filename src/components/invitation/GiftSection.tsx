"use client";

import { useEffect, useState } from "react";
import { InvitationSection } from "@/components/invitation/InvitationSection";
import type { BankAccount } from "@/lib/site-settings";

const LOGO_HEIGHT = 36;

export function GiftSection({ accounts }: { accounts: BankAccount[] }) {
  return (
    <InvitationSection section="gifts" mediaAlt="">
      <p className="text-xs tracking-[0.3em] text-white uppercase">
        Wedding gift
      </p>
      <h2 className="font-display mt-3 text-3xl">Angpao</h2>
      <p className="mt-2 max-w-xs text-sm text-muted">
        Send a gift online to one of these accounts.
      </p>
      <div className="mt-4 w-full space-y-2">
        {accounts.map((account) => (
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
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {account.logo ? <BankLogo src={account.logo} /> : null}
          <p className="font-mono text-sm tracking-wide">{account.number}</p>
        </div>
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
