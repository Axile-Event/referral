import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/referral";
import { walletApi } from "@/lib/api/wallet";

/**
 * useRefereeStats
 * Fetches the global summary statistics for the dashboard.
 */
export function useRefereeStats() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["referee", "stats", "aggregated"],
    queryFn: async () => {
      try {
        // 1. Fetch the list of events
        const eventRes = await referralApi.getReferrableEvents();
        const events = eventRes.events || [];
        
        let totals = {
          tickets_sold: 0,
          referral_revenue: 0,
          pending_earnings: 0,
          checked_in: 0,
          balance: 0
        };

        // 2. Aggregate stats from each event
        // We use Promise.allSettled to ensure one bad event doesn't break the whole dashboard
        const statsPromises = events.map(ev => referralApi.getEventStats(ev.event_id));
        const results = await Promise.allSettled(statsPromises);

        results.forEach(result => {
          if (result.status === "fulfilled" && result.value) {
            const eventStats = result.value;
            const tickets = eventStats.tickets || [];
            
            totals.tickets_sold += (eventStats.tickets_sold || 0);

            // Split revenue by checked-in status
            tickets.forEach(ticket => {
              const ticketPrice = Number(ticket.category_price) || 0;
              // Assuming 'is_checked_in' is the field for check-in status
              if (ticket.status?.toLowerCase() === "checked_in" || ticket.is_checked_in === true) {
                totals.referral_revenue += ticketPrice;
                totals.checked_in += 1;
              } else {
                totals.pending_earnings += ticketPrice;
              }
            });

            // If the backend also provides a global revenue we use it as fallback if tickets array is empty
            if (tickets.length === 0) {
              totals.referral_revenue += (eventStats.referral_revenue || 0);
            }
          }
        });

        // 3. Try to get balance from wallet as a bonus, but don't fail if it 404s
        try {
          const wallet = await walletApi.getStats();
          totals.balance = wallet.balance || 0;
        } catch (e) { /* ignore wallet 404 */ }

        console.log("DEBUG: Aggregated Dashboard Stats:", totals);
        return totals;
      } catch (error) {
        console.error("DEBUG: Aggregation failed:", error);
        return { tickets_sold: 0, referral_revenue: 0, pending_earnings: 0, checked_in: 0, balance: 0 };
      }
    },
    refetchInterval: 30000, // Refresh every 30s
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
    queryKey: ["referee", "activity", "aggregated"],
    queryFn: async () => {
      try {
        // 1. Fetch events
        const eventRes = await referralApi.getReferrableEvents();
        const events = eventRes.events || [];

        // 2. Aggregate tickets from stats
        const results = await Promise.allSettled(events.map(ev => referralApi.getEventStats(ev.event_id)));
        let allTickets = [];

        results.forEach((result, idx) => {
           if (result.status === "fulfilled" && result.value?.tickets) {
              const eventInfo = events[idx];
              const eventTickets = result.value.tickets.map(t => ({
                 ...t,
                 event_name: eventInfo.name,
                 event_id: eventInfo.event_id,
                 // Map tickets field to activity table field names
                 status: t.status || "sold",
                 date: t.purchase_date || t.created_at || new Date().toISOString()
              }));
              allTickets = [...allTickets, ...eventTickets];
           }
        });

        // Sort by date descending
        allTickets.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log("DEBUG: Consolidating Activity from Tickets:", allTickets);
        return allTickets;
      } catch (error) {
        console.error("DEBUG: Activity aggregation failed:", error);
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
