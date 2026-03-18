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
  const referrals = [
    // Empty for now to show empty state or stubs
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Referrals</h1>
          <p className="text-sm text-gray-400 font-medium">Manage and track your referral links and conversions.</p>
        </div>
        <Button className="rounded-xl gap-2 font-bold">
          <Plus size={18} />
          Create Link
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="Total Links" value="0" />
        <MiniStat label="Total Clicks" value="0" />
        <MiniStat label="Conversions" value="0" />
        <MiniStat label="Conversion Rate" value="0%" />
      </div>

      {/* Table Section */}
      <div className="bg-[#12121f] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input placeholder="Search links or events..." className="bg-white/5 rounded-xl border-white/5" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-white/5 text-xs">
              <Filter size={14} className="mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl border-white/5 text-xs">
              Export
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
             <BarChart3 size={28} />
           </div>
           <div className="space-y-2">
             <h4 className="text-lg font-bold text-white">No referrals yet</h4>
             <p className="text-gray-400 max-w-xs mx-auto text-sm">
               Generate your first referral link to start earning rewards.
             </p>
           </div>
           <Button variant="outline" className="border-primary/20 hover:border-primary text-primary hover:bg-primary/5 rounded-xl">
             Generate Now
           </Button>
        </div>
      </div>
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
