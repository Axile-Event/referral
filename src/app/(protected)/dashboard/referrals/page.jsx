import Link from "next/link";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Filter,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * Referrals Management Page
 * Redesigned for visual consistency with the new dashboard.
 */
export default function ReferralsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse">
        <BarChart3 size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Referrals</h1>
      <p className="text-gray-400 font-medium tracking-tight">This page is currently under development.</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-4 rounded-2xl space-y-1">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
      <h4 className="text-xl font-extrabold text-white tracking-tight">{value}</h4>
    </div>
  );
}
