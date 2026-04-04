import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/referral";
import { walletApi } from "@/lib/api/wallet";

/**
 * fetchAllEventStats
 * Helper to fetch stats for all referrable events in parallel.
 * This is the temporary frontend aggregation logic.
 */
async function fetchAllEventStats() {
    const eventRes = await referralApi.getReferrableEvents();
    const events = eventRes.events || [];
    
    const results = await Promise.allSettled(
        events.map(ev => referralApi.getEventStats(ev.event_id))
    );
    
    return results.map((res, idx) => ({
        event: events[idx],
        stats: res.status === "fulfilled" ? res.value : null
    })).filter(item => item.stats !== null);
}

/**
 * useRefereeStats
 * Fetches the global summary statistics for the dashboard.
 */
export function useRefereeStats() {
  return useQuery({
    queryKey: ["referee", "stats", "aggregated"],
    queryFn: async () => {
      try {
        const eventStats = await fetchAllEventStats();
        
        let totals = {
          tickets_sold: 0,
          referral_revenue: 0,
          pending_earnings: 0,
          checked_in: 0,
          balance: 0
        };

        eventStats.forEach(({ stats }) => {
            const tickets = stats.tickets || [];
            totals.tickets_sold += (stats.tickets_sold || 0);

            tickets.forEach(ticket => {
                const ticketPrice = Number(ticket.category_price) || 0;
                if (ticket.status?.toLowerCase() === "checked_in" || ticket.is_checked_in === true) {
                    totals.referral_revenue += ticketPrice;
                    totals.checked_in += 1;
                } else {
                    totals.pending_earnings += ticketPrice;
                }
            });

            if (tickets.length === 0) {
                totals.referral_revenue += (stats.referral_revenue || 0);
            }
        });

        // Try wallet stats as bonus
        try {
          const wallet = await walletApi.getStats();
          totals.balance = wallet.balance || 0;
        } catch (e) { /* ignore 404 */ }

        return totals;
      } catch (error) {
        console.error("Aggregation failed:", error);
        return { tickets_sold: 0, referral_revenue: 0, pending_earnings: 0, checked_in: 0, balance: 0 };
      }
    },
    refetchInterval: 30000,
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
    enabled: !!eventId,
  });
}

/**
 * useRefereeActivity
 * Fetches the activity history for the dashboard table.
 */
export function useRefereeActivity() {
  return useQuery({
    queryKey: ["referee", "activity", "aggregated"],
    queryFn: async () => {
      try {
        const eventStats = await fetchAllEventStats();
        let allTickets = [];

        eventStats.forEach(({ event, stats }) => {
            if (stats.tickets) {
                const eventTickets = stats.tickets.map(t => ({
                    ...t,
                    event_name: event.name,
                    event_id: event.event_id,
                    status: t.status || "sold",
                    date: t.purchase_date || t.created_at || new Date().toISOString()
                }));
                allTickets = [...allTickets, ...eventTickets];
            }
        });

        return allTickets.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (error) {
        console.error("Activity aggregation failed:", error);
        return [];
      }
    },
    refetchInterval: 60000,
  });
}

/**
 * useUserReferrals
 * Fetches all of the current user's generated tracking links/campaigns.
 */
export function useUserReferrals() {
  return useQuery({
    queryKey: ["referee", "referrals", "active"],
    queryFn: async () => {
      try {
        const eventRes = await referralApi.getReferrableEvents();
        const events = eventRes.events || [];
        
        // Fetch stats for all events in parallel to find active ones
        const statsResults = await Promise.allSettled(events.map(ev => referralApi.getEventStats(ev.event_id)));
        
        const activeCampaigns = [];
        statsResults.forEach((result, idx) => {
          if (result.status === "fulfilled" && result.value) {
            // Only consider it an 'active campaign' if tickets have been sold
            if (result.value.tickets_sold > 0) {
              activeCampaigns.push({
                ...events[idx],
                stats: result.value
              });
            }
          }
        });

        console.log("DEBUG: Discovered Active Campaigns:", activeCampaigns);
        return activeCampaigns;
      } catch (error) {
        console.error("DEBUG: Failed to discover active referrals:", error);
        return [];
      }
    },
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
