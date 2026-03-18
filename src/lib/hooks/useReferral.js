import { useReferralStore } from "@/store/referralStore";

/**
 * useReferral hook
 * Convenience wrapper around useReferralStore.
 */
export function useReferral() {
  const {
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  } = useReferralStore();

  return {
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  };
}
