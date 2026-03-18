"use client";

/**
 * Referral Form Component
 *
 * Form to generate a referral link for an event.
 * Uses react-hook-form for validation.
 *
 * Props: eventId, onSuccess(link)
 * TODO: Call referralApi.generateLink(eventId)
 */
export function ReferralForm({ eventId, onSuccess }) {
  const handleGenerate = async () => {
    // TODO: useReferralStore.generateReferralLink(eventId)
    onSuccess?.(`${process.env.NEXT_PUBLIC_APP_URL}/ref/DEMO123/event/${eventId}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Generate a unique referral link for this event.
      </p>
      <button
        onClick={handleGenerate}
        className="h-10 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Generate Link
      </button>
    </div>
  );
}
