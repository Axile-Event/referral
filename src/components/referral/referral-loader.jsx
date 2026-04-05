import Image from "next/image";

/**
 * ReferralLoader
 * Minimal branded loader used during the referral redirect flow.
 * Shows Axile branding + a spinner with optional status text.
 */
export function ReferralLoader({ text = "Preparing your experience..." }) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Brand logo */}
        <div className="mb-4">
          <Image 
            src="/axile-logo-main.png" 
            alt="Axile" 
            width={180} 
            height={60} 
            className="h-auto w-auto max-w-[220px] animate-pulse"
            priority
          />
        </div>

        {/* Status text */}
        <p className="text-[15px] text-gray-400 font-medium tracking-wide">
          {text}
        </p>
      </div>
    </div>
  );
}
