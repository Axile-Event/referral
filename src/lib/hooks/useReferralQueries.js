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
