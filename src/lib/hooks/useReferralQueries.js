import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/referral";
import { walletApi } from "@/lib/api/wallet";

/**
 * useRefereeStats
 * Fetches the global summary statistics for the dashboard.
 */
export function useRefereeStats() {
  return useQuery({
    queryKey: ["referee", "stats"],
    queryFn: async () => {
      try {
        const data = await walletApi.getStats();
        return {
          tickets_sold: data.tickets_sold || 0,
          referral_revenue: data.referral_revenue || 0,
          pending_earnings: data.pending_earnings || 0,
          checked_in: data.checked_in || 0,
          balance: data.balance || 0,
        };
      } catch (error) {
        console.error("DEBUG: Global stats fetch failed:", {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data || error.message
        });
        console.warn("Global stats not available, returning defaults.");
        return { tickets_sold: 0, referral_revenue: 0, pending_earnings: 0, checked_in: 0, balance: 0 };
      }
    },
  });
}

/**
 * useEventStats
 * Fetches the stats for a specific event with 15s polling.
 */
export function useEventStats(eventId) {
  return useQuery({
    queryKey: ["referee", "stats", eventId],
    queryFn: () => referralApi.getEventStats(eventId),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    enabled: !!eventId,
  });
}

/**
 * useRefereeActivity
 * Fetches the activity history for the dashboard table.
 */
export function useRefereeActivity() {
  return useQuery({
    queryKey: ["referee", "activity"],
    queryFn: async () => {
      try {
        return await walletApi.getTransactions();
      } catch (error) {
        return [];
      }
    },
  });
}

/**
 * useUserReferrals
 * Fetches all of the current user's generated tracking links/campaigns.
 */
export function useUserReferrals() {
  return useQuery({
    queryKey: ["referee", "referrals"],
    queryFn: () => referralApi.getUserReferrals(),
  });
}

/**
 * useReferrableEvents
 * Fetches events eligible for referral.
 */
export function useReferrableEvents() {
  return useQuery({
    queryKey: ["referee", "events"],
    queryFn: async () => {
      const data = await referralApi.getReferrableEvents();
      console.log("DEBUG: Raw Response from /referee/events/:", data);
      return data;
    },
  });
}

/**
 * useReferrableEventDetail
 * Fetches details for a single referrable event.
 */
export function useReferrableEventDetail(eventId) {
  return useQuery({
    queryKey: ["referee", "events", eventId],
    queryFn: () => referralApi.getEventDetails(eventId),
    enabled: !!eventId,
  });
}

/**
 * useDiscoveryEvents
 * Used for the discovery page / marketplace.
 */
export function useDiscoveryEvents() {
  return useQuery({
    queryKey: ["referee", "events", "discovery"],
    queryFn: () => referralApi.getReferrableEvents(),
  });
}

/**
 * Invalidation Helper
 * Call this after actions like generating a new link.
 */
export function useInvalidateReferralData() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["referee"] });
  };
}
