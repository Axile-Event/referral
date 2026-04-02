import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/referral";

/**
 * useRefereeStats
 * Fetches the global summary statistics for the dashboard.
 */
export function useRefereeStats() {
  return useQuery({
    queryKey: ["referee", "stats"],
    queryFn: () => referralApi.getRefereeStats(),
    // Global defaults handle staleTime and refetchInterval
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
    queryFn: () => referralApi.getRefereeActivity(),
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
    queryFn: () => referralApi.getReferrableEvents(),
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
