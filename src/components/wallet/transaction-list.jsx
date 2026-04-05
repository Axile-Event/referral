import { 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Ticket, 
  Briefcase, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils/cn.js";

/**
 * Transaction History Component
 */
export function TransactionList({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-600">
           <History size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white tracking-tight">No Transactions</h4>
          <p className="text-gray-500 text-sm font-medium">Your earning activities will appear here.</p>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "referral": return <Ticket className="text-green-500" size={18} />;
      case "withdrawal": return <ArrowUpRight className="text-red-500" size={18} />;
      default: return <Briefcase className="text-primary" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500";
      case "pending": return "bg-yellow-500/10 text-yellow-500";
      case "failed": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="bg-[#12121f]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount (₦)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      {getIcon(tx.type)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight leading-none mb-1.5">{tx.description}</p>
                      <p className="text-xs text-gray-500 font-medium leading-none">{tx.date || "Just now"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-semibold text-gray-300 capitalize">{tx.type}</p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex justify-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        getStatusColor(tx.status)
                      )}>
                        {tx.status}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <p className={cn(
                     "text-sm font-extrabold tracking-tight",
                     tx.type === "referral" ? "text-green-500" : "text-white"
                   )}>
                     {tx.type === "referral" ? "+₦" : "-₦"}{tx.amount.toLocaleString()}
                   </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
