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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Points Wallet</h1>
          <p className="text-sm text-gray-400 font-medium">Manage your earned points. 10 AP = ₦100. Min withdrawal: 50 AP.</p>
        </div>
        <Button className="rounded-xl gap-2 font-bold px-8">
          <Plus size={18} />
          Add Bank
        </Button>
      </div>

      {/* Balance Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-[#be123c] p-8 lg:p-12 shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={160} />
          </div>
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-2">
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Available Points (AP)</p>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">0.00 AP</h2>
              <p className="text-white/50 text-xl font-bold">≈ ₦0.00</p>
            </div>

            <div className="flex flex-wrap gap-4">
               <Button className="bg-white text-primary hover:bg-white/90 px-8 rounded-xl font-black h-14">
                 Withdraw Funds
               </Button>
               <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 rounded-xl font-bold h-14">
                 View Reports
               </Button>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="space-y-6">
           <SmallBalanceCard label="Pending AP" value="0.00 AP" icon={ClockIcon} />
           <SmallBalanceCard label="Total Withdrawn" value="0.00 AP" icon={Landmark} />
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <History size={20} className="text-primary" />
          <h3 className="text-xl font-bold text-white tracking-tight">Transaction History</h3>
        </div>

        <div className="bg-[#12121f] border border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
             <TrendingUp size={28} />
           </div>
           <div className="space-y-2">
             <h4 className="text-lg font-bold text-white">No transactions yet</h4>
             <p className="text-gray-400 max-w-xs mx-auto text-sm">
               Your referral earnings will appear here once they are processed.
             </p>
           </div>
        </div>
      </div>
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
