import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Wallet Card Component
 * Redesigned to match the "Available Points" view.
 * 
 * Props:
 * - balance: Points available
 * - nairaVal: Equivalent in Naira (already converted)
 * - onWithdraw: Action trigger
 * - onViewReports: Action trigger
 */
export function WalletCard({ balance = 0, nairaVal = 0, onWithdraw, onViewReports }) {
  return (
    <div className="relative overflow-hidden bg-primary p-12 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl shadow-primary/20 h-[380px] w-full">
      {/* Wallet Icon Background Element */}
      <div className="absolute right-[-20px] top-[15%] opacity-10 pointer-events-none transform rotate-[-5deg]">
        <Wallet size={340} strokeWidth={1} />
      </div>

      <div className="relative z-10 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[3px] text-white/70 leading-none">
          AVAILABLE POINTS (AP)
        </p>
        <div className="space-y-1">
          <h2 className="text-8xl font-extrabold tracking-[-3px] leading-tight flex items-baseline">
            {balance.toLocaleString(undefined, { minimumFractionDigits: 1 })}{" "}
            <span className="text-4xl tracking-normal ml-3 font-bold opacity-90">AP</span>
          </h2>
          <p className="text-2xl font-bold text-white/50 tracking-tight leading-none pl-1">
             ≈ ₦{nairaVal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 mt-8">
        <button
          onClick={onWithdraw}
          className="bg-white text-primary px-8 h-12 rounded-2xl text-sm font-bold shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
        >
          Withdraw Funds
        </button>
        <button
          onClick={onViewReports}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 h-12 rounded-2xl text-sm font-bold backdrop-blur-sm active:scale-95 transition-all"
        >
          View Reports
        </button>
      </div>
    </div>
  );
}
