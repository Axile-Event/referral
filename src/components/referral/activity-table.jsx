import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, Search, ExternalLink } from "lucide-react";
import { useRefereeActivity } from "@/lib/hooks/useReferralQueries";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";

/**
 * ActivityTable
 * Displays the recent referral lifecycle history.
 * Masked buyer IDs and distinct status badges.
 */
export function ActivityTable() {
  const router = useRouter();
  const { data: activity, isLoading } = useRefereeActivity();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#12121f] rounded-2xl border border-white/5 overflow-hidden animate-pulse">
        <div className="h-16 border-b border-white/5" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 border-b border-white/5 mx-6" />
        ))}
      </div>
    );
  }

  // Handle empty state
  const hasActivity = activity && activity.length > 0;

  const handleRowClick = (entry) => {
     // Go to the full event stats if event_id or event_slug is available
     const eventId = entry.event_id || entry.event_slug;
     if (eventId) {
        router.push(`/dashboard/events/${eventId}/stats`);
     }
  };

  return (
    <div className="bg-[#12121f] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-semibold text-white/90">Referral activity</h3>
        <span className="text-[12px] text-gray-500 font-medium">{activity?.length || 0} entries</span>
      </div>

      {!hasActivity ? (
        <div className="flex flex-col items-center justify-center p-24 text-center text-gray-400">
          <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 border border-white/5">
            <Search size={28} className="opacity-20" />
          </div>
          <p className="text-white font-medium mb-1">No activity yet</p>
          <p className="text-sm mb-8 text-gray-500 max-w-[280px]">
             Your referral links haven't been used yet. Start sharing to track conversions.
          </p>
          <Button asChild variant="outline" className="border-white/10 text-white rounded-xl hover:bg-white/5 h-11 px-6">
            <Link href="/events/referral-enabled">
              Browse Programs
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-white/5">Event</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-white/5">Buyer</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-white/5">Status</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-white/5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activity.map((entry, i) => (
                <tr 
                   key={i} 
                   onClick={() => handleRowClick(entry)}
                   className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Ticket size={14} />
                       </div>
                       <span className="text-sm font-medium text-white/90 truncate max-w-[200px]">
                         {entry.event_name || entry.description || "Activity Entry"}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-mono text-gray-500">
                      {entry.buyer_name || entry.buyer_id ? (entry.buyer_name || `${entry.buyer_id.slice(0, 4)}****`) : (entry.amount || entry.category_price ? `₦${entry.amount || entry.category_price}` : "---")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] text-gray-400 font-medium">
                      { (entry.date || entry.timestamp || entry.created_at) ? new Date(entry.date || entry.timestamp || entry.created_at).toLocaleDateString("en-GB", {
                         day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      }) : "--"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
