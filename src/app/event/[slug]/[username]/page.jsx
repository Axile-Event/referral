"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getMainAppUrl } from "@/lib/utils/referral";

/**
 * Referral Entry Page
 * Route: /event/[slug]/[username]
 * 
 * Flow:
 * 1. Capture slug and username from params
 * 2. Set ref_username cookie (expires in 7 days)
 * 3. Redirect to the main Axile app event page
 */
export default function ReferralEntryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const username = params?.username;

  useEffect(() => {
    if (slug && username) {
      console.log(`Processing referral: Event=${slug}, Referrer=${username}`);
      
      // Set the ref_username cookie (7 days)
      Cookies.set("ref_username", username, { 
        expires: 7, 
        path: "/",
        sameSite: "lax"
      });

      // Build main app redirect URL
      // Target: https://axile.ng/events/{slug}?ref={username}
      const mainAppUrl = getMainAppUrl();
      const redirectUrl = `${mainAppUrl}/events/${slug}?ref=${username}`;
      
      console.log(`Redirecting to: ${redirectUrl}`);
      window.location.href = redirectUrl;
    }
  }, [slug, username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-xl font-semibold mb-2">Syncing Referral...</h1>
      <p className="text-white/60 text-sm">Redirecting you to the event page</p>
    </div>
  );
}
