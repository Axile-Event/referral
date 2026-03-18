"use client";

import { useState } from "react";

/**
 * Referral Link Component
 *
 * Features:
 * - Display referral URL
 * - Copy to clipboard button
 * - QR code preview (TODO: qrcode.react)
 * - Share buttons (WhatsApp, Twitter, Email)
 */
export function ReferralLink({ refLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={refLink}
          className="flex-1 h-10 px-3 rounded-lg border border-input bg-secondary text-sm font-mono focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* TODO: QR code via qrcode.react QRCode component */}
      <div className="flex gap-2 mt-1">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(refLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(refLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors"
        >
          Twitter
        </a>
        <a
          href={`mailto:?body=${encodeURIComponent(refLink)}`}
          className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors"
        >
          Email
        </a>
      </div>
    </div>
  );
}
