"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { buildRedirectUrl, getCookieDomain } from "@/lib/utils/referral";
import { trackReferralClick } from "@/lib/api/referral";

/**
 * Referral Redirect Page (Legacy Format)
 * Path: /ref/[code]/event/[id]
 * 
 * Logic:
 * 1. Extract and clean params
 * 2. Set ref_username cookie for cross-domain persistence
 * 3. Track click (fire and forget)
 * 4. Redirect to Landing Page event page
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

    // Set ref_username cookie (7 days) with cross-subdomain support
    const cookieOpts = {
      expires: 7,
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:"
    };
    const domain = getCookieDomain();
    if (domain) cookieOpts.domain = domain;
    
    Cookies.set("ref_username", code, cookieOpts);

    // Track click (fire and forget - do not await)
    trackReferralClick(code, cleanId);

    // Redirect to landing page event page (buildRedirectUrl now targets landing)
    const targetUrl = buildRedirectUrl(cleanId, code);
    
    // Use window.location for cross-origin redirect
    window.location.href = targetUrl;
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

