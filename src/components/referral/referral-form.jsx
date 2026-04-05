import { useReferralStore } from "@/store/referralStore";
import { useState } from "react";
import { useInvalidateReferralData } from "@/lib/hooks/useReferralQueries";
import toast from "react-hot-toast";

/**
 * Referral Form Component
 *
 * Form to generate a referral link for an event.
 * Now connects to the real referralStore for dynamic link generation.
 */
export function ReferralForm({ eventId, onSuccess }) {
  const [generating, setGenerating] = useState(false);
  const generateReferralLink = useReferralStore((s) => s.generateReferralLink);
  const invalidate = useInvalidateReferralData();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const link = await generateReferralLink(eventId);
      if (link) {
        // Invalidate queries to ensure dashboard metrics are updated
        invalidate();
        onSuccess?.(link);
        toast.success("Referral link generated!");
      }
    } catch (err) {
      toast.error("Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">Generate Referral Link</p>
        <p className="text-xs text-gray-400">
          Created a unique link to track your referrals for this event.
        </p>
      </div>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="h-11 px-5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {generating ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Link"
        )}
      </button>
    </div>
  );
}
