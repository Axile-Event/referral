"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getLandingPageUrl } from "@/lib/utils/referral";

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
      
      // Set the ref_username cookie (7 days) with cross-subdomain support
      Cookies.set("ref_username", username, { 
        expires: 7, 
        path: "/",
        domain: ".axile.ng", // Allows landing/app subdomains to read it
        sameSite: "lax",
        secure: true
      });

      // Target: https://axile.ng/events/{slug}?ref={username}
      const landingUrl = getLandingPageUrl();
      const redirectUrl = `${landingUrl}/events/${slug}?ref=${username}`;
      
      console.log(`Redirecting to: ${redirectUrl}`);
      window.location.href = redirectUrl;
    }
  }, [slug, username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      
      <div className="flex flex-col items-center relative z-10 scale-110">
        {/* Bolder Logo Display */}
        <div className="mb-14 relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 group-hover:bg-primary/30 transition-all opacity-40 animate-pulse" />
          <img 
            src="/Axile logo.png" 
            alt="Axile" 
            className="h-16 w-auto object-contain relative z-10 brightness-110 contrast-125"
          />
        </div>

        {/* Loading Interaction */}
        <div className="relative mb-8">
           <div className="w-16 h-16 border-4 border-white/5 rounded-full absolute" />
           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(227,54,41,0.3)]" />
        </div>

        {/* Redirecting Message */}
        <div className="flex flex-col items-center space-y-3">
          <h1 className="text-xl font-bold tracking-tight text-white/90">
            Redirecting...
          </h1>
          
          {username && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-700">
               <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Referral By</span>
               <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(227,54,41,0.4)] tracking-tight">
                 @{username}
               </span>
            </div>
          )}

          <p className="text-white/40 text-[13px] italic pt-6 font-medium tracking-wide">
            Taking you to the event page
          </p>
        </div>
      </div>
    </div>
  );
}
