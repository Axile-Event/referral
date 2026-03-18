import Link from "next/link";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  History,
  TrendingUp,
  Landmark,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * Wallet Page
 * Redesigned with a premium "Glass Card" balance view and transaction list.
 */
export default function WalletPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse">
        <Wallet size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Wallet</h1>
      <p className="text-gray-400 font-medium tracking-tight">This page is currently under development.</p>
    </div>
  );
}

function SmallBalanceCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-primary/20 transition-all">
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl font-extrabold text-white tracking-tight">{value}</h4>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
        <Icon size={24} />
      </div>
    </div>
  );
}

function ClockIcon(props) {
  return <Clock {...props} />;
}
