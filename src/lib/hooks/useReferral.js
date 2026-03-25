import { useReferralStore } from "@/store/referralStore";

/**
 * useReferral hook
 * Convenience wrapper around useReferralStore.
 */
export function useReferral() {
  const {
    referrableEvents,
    selectedEvent,
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchReferrableEvents,
    fetchReferrableEventDetail,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  } = useReferralStore();

  return {
    referrableEvents,
    selectedEvent,
    referrals,
    myReferralCode,
    totalEarnings,
    isLoading,
    fetchReferrableEvents,
    fetchReferrableEventDetail,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  };
}
