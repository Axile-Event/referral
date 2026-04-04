"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { buildRedirectUrl } from "@/lib/utils/referral";
import { trackReferralClick } from "@/lib/api/referral";

/**
 * Referral Redirect Page
 * Path: /ref/[code]/event/[id]
 * 
 * Logic:
 * 1. Extract and clean params
 * 2. Track click (fire and forget)
 * 3. Redirect to main app
 */
export default function ReferralRedirectPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const { code, id } = params;

    // Safety: Missing params redirect to homepage
    if (!code || !id) {
      router.replace("/");
      return;
    }

    // Clean event ID (remove 'event:' prefix)
    const cleanId = id.replace("event:", "");

    // Track click (fire and forget - do not await)
    trackReferralClick(code, cleanId);

    // Redirect to main app using utility (dynamic base URL)
    const targetUrl = buildRedirectUrl(cleanId, code);
    
    // Immediate redirection
    router.replace(targetUrl);
  }, [params, router]);

  // Minimal centered loader UI
  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/Axile logo.png" 
          alt="Axile Logo" 
          className="h-8 w-auto object-contain animate-pulse"
        />
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[13px] text-white/30 font-medium tracking-wide">
          Redirecting {params?.code ? `(${params.code})` : ""}...
        </p>
      </div>
    </div>
  );
}
