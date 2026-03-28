"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ReferralLoader } from "@/components/referral/referral-loader";
import { buildRedirectUrl } from "@/lib/utils/referral";

/**
 * Referral Entry Page
 * Handles redirection from /ref/[code]/event/[id] to the main Axile app
 * Target: https://axiledev.vercel.app/event/[id]?ref=[code]
 */
export default function ReferralRedirectPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const isRedirecting = useRef(false);

  useEffect(() => {
    // Prevent double-invocation in development/strict mode
    if (isRedirecting.current) return;
    isRedirecting.current = true;

    // 1. Extract params
    const { code, id } = params;

    // 4. Add safety: If code or id missing, redirect to homepage
    if (!code || !id) {
      router.replace("/");
      return;
    }

    // 3. Redirect correctly to the targeted Axile domain
    // All ID cleaning and base URL logic is handled by the utility
    const targetUrl = buildRedirectUrl(id, code);
    
    // Final redirect to the main Axile event page
    router.replace(targetUrl);
  }, [params, router]);

  // 5. Minimal UI: Show loader while redirecting
  return <ReferralLoader text="Redirecting to event..." />;
}
