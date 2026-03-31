import { cn } from "@/lib/utils/cn.js";

/**
 * StatCard Component
 * Small secondary cards for wallet stats (Pending, Withdrawn).
 */
export function StatCard({ label, value, icon: Icon, className }) {
  return (
    <div className={cn(
      "bg-[#12121f] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-white/10 transition-all w-full",
      className
    )}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">{label}</p>
        <h4 className="text-2xl font-bold text-white tracking-tight leading-none pt-1">{value} AP</h4>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-white/10 transition-colors">
        <Icon size={24} />
      </div>
    </div>
  );
}
