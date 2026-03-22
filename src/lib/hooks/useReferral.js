import { useReferralStore } from "@/store/referralStore";

/**
 * useReferral hook
 * Convenience wrapper around useReferralStore.
 */
export function useReferral() {
  const {
    referrableEvents,
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchReferrableEvents,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  } = useReferralStore();

  return {
    referrableEvents,
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchReferrableEvents,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  };
}
