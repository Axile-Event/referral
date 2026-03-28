"use client";

import { useEffect, useRef, use } from "react";
import { useReferralEntryStore } from "@/store/referralEntryStore";
import { ReferralLoader } from "@/components/referral/referral-loader";
import {
  buildRedirectUrl,
  isValidReferralCode,
  isValidEventId,
} from "@/lib/utils/referral";

/**
 * Referral Entry Route — THE CORE REDIRECT
 *
 * Route: /ref/[code]/event/[id]
 * Redirects to: https://axile.ng/event/[id]?ref=[code]
 *
 * Flow:
 * 1. Extract code + eventId from params
 * 2. Validate both params
 * 3. Persist via Zustand + localStorage (setReferral)
 * 4. Redirect to main app with referral code in URL
 *
 * Edge cases:
 * - Invalid params → fallback redirect to axile.ng
 * - Multiple clicks → latest always wins (handled by store)
 * - Direct navigation → safe, shows loader then redirects
 */
export default function ReferralRedirectPage({ params }) {
  const { code, id } = use(params);
  const setReferral = useReferralEntryStore((s) => s.setReferral);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Guard against double-execution in React strict mode
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    const trimmedCode = code?.trim();
    const trimmedId = id?.trim();

    // Validate params
    const validCode = isValidReferralCode(trimmedCode);
    const validId = isValidEventId(trimmedId);

    if (validCode && validId) {
      // Persist referral data (latest always wins)
      setReferral(trimmedCode, trimmedId);

      // Redirect to main app with referral attached
      const redirectUrl = buildRedirectUrl(trimmedId, trimmedCode);
      window.location.replace(redirectUrl);
    } else {
      // Invalid params — redirect to main app homepage as safe fallback
      window.location.replace("https://axile.ng");
    }
  }, [code, id, setReferral]);

  return <ReferralLoader text="Redirecting you to the event..." />;
}
