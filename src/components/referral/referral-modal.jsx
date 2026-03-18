"use client";

/**
 * Referral Modal Component
 *
 * Shows referral link + QR code in a dialog/modal.
 * Uses @radix-ui/react-dialog.
 *
 * Props: isOpen, onClose, refLink, eventName
 * TODO: Add qrcode.react QRCode display
 */
export function ReferralModal({ isOpen, onClose, refLink, eventName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-1">Your Referral Link</h2>
        <p className="text-muted-foreground text-sm mb-4">{eventName}</p>

        {/* TODO: ReferralLink component */}
        <div className="bg-secondary rounded-lg px-4 py-3 font-mono text-sm break-all mb-4">
          {refLink}
        </div>

        {/* TODO: QR code */}
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground mx-auto mb-4">
          QR Code
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
