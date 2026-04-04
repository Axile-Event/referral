"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getMainAppUrl } from "@/lib/utils/referral";

/**
 * Referral Entry Page
 * Route: /event/[slug]/[username]
 */
export default function ReferralEntryPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
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

      // Target: https://axile.ng/events/{slug}?ref={username}
      const mainAppUrl = getMainAppUrl();
      const redirectUrl = `${mainAppUrl}/events/${slug}?ref=${username}`;
      
      console.log(`Redirecting to: ${redirectUrl}`);
      window.location.href = redirectUrl;
    }
  }, [slug, username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
      <img 
        src="/Axile logo.png" 
        alt="Axile" 
        className="h-12 w-auto object-contain mb-10 animate-pulse"
      />
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-xl font-semibold mb-2">
        {username ? `Redirecting to @${username}'s Referral...` : "Redirecting..."}
      </h1>
      <p className="text-white/60 text-sm italic">You're being redirected to the event page</p>
    </div>
  );
}
