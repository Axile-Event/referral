"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ReferralLoader } from "@/components/referral/referral-loader";

/**
 * Referral Entry Page
 * Handles redirection from /ref/[code]/event/[id] to /event/[id]?ref=[code]
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

    // 2. Clean eventId
    // IDs like 'event:EV-99284' must be cleaned to 'EV-99284'
    const cleanEventId = id.replace("event:", "");

    // 3. Redirect correctly 
    // Uses current environment's origin to avoid hardcoded URLs
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const targetPath = `/event/${cleanEventId}?ref=${code}`;
    
    // Final redirect to the Axile domain / event page
    router.replace(`${currentOrigin}${targetPath}`);
  }, [params, router]);

  // 5. Minimal UI: Show loader while redirecting
  return <ReferralLoader text="Redirecting to event..." />;
}
