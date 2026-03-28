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
    isLoading,
    stats,
    eventStats,
    fetchEventStats,
    calculateGlobalStats,
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
    isLoading,
    stats,
    eventStats,
    fetchEventStats,
    calculateGlobalStats,
    fetchReferrableEvents,
    fetchReferrableEventDetail,
    fetchUserReferrals,
    generateReferralLink,
    trackReferralClick,
  };
}
