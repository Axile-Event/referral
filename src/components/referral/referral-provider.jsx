"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReferralEntryStore } from "@/store/referralEntryStore";

/**
 * ReferralProvider
 *
 * Wrap the app root with this component.
 * On mount, hydrates referral state from localStorage and
 * auto-clears expired entries. No UI — purely a side-effect provider.
 */
export function ReferralProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000, // 30 seconds
        refetchInterval: 15000, // 15 seconds polling
        refetchIntervalInBackground: false, // Stop polling when tab is not focused
        retry: 1,
      },
    },
  }));

  const hydrate = useReferralEntryStore((s) => s.hydrate);
  const clearReferral = useReferralEntryStore((s) => s.clearReferral);
  const timestamp = useReferralEntryStore((s) => s.timestamp);
  const isExpired = useReferralEntryStore((s) => s.isExpired);

  // Hydrate on app mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Auto-clear expired referrals
  useEffect(() => {
    if (timestamp && isExpired()) {
      clearReferral();
    }
  }, [timestamp, isExpired, clearReferral]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
