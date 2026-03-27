/**
 * ReferralLoader
 * Minimal branded loader used during the referral redirect flow.
 * Shows Axile branding + a spinner with optional status text.
 */
export function ReferralLoader({ text = "Preparing your experience..." }) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Brand mark */}
        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-black text-2xl">A</span>
        </div>

        {/* Spinner */}
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />

        {/* Status text */}
        <p className="text-sm text-gray-400 font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
}
