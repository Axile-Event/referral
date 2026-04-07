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
/**
 * Transaction History Component
 * Supports both Earnings (Wallet Transactions) and Payouts (Withdrawal Requests)
 */
export function TransactionList({ transactions = [], type = "earnings" }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-[#12121f] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-600">
           <History size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white tracking-tight">
            {type === "earnings" ? "No Earnings Yet" : "No Payout Requests"}
          </h4>
          <p className="text-gray-500 text-sm font-medium">
            {type === "earnings" 
              ? "Your commissions from successful referrals will appear here." 
              : "Your withdrawal history will appear here."}
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (txType) => {
    switch (txType) {
      case "referral_reward": 
      case "referral": return <Ticket className="text-green-500" size={18} />;
      case "withdrawal": 
      case "referral_refund": return <ArrowUpRight className="text-red-500" size={18} />;
      default: return <Briefcase className="text-primary" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "approved": return "bg-green-500/10 text-green-500";
      case "pending": return "bg-yellow-500/10 text-yellow-500";
      case "rejected":
      case "failed": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="bg-[#12121f]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {type === "earnings" ? "Source / Description" : "Request ID / Details"}
              </th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount (₦)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {transactions.map((tx, index) => {
              // Support both wallet transaction shape AND recent_activity shape
              const id = tx.transaction_id || tx.request_id || tx.ticket_id || tx.event_id || `tx-${index}`;
              const date = tx.created_at || tx.date || new Date().toISOString();

              // Status: wallet transaction uses tx.status, recent_activity uses tx.ticket_status
              const rawStatus = tx.status || tx.ticket_status || "completed";
              const status = rawStatus === "confirmed" ? "completed" : rawStatus;

              // Amount: wallet transaction uses tx.amount, recent_activity uses tx.referral_earnings_for_ticket
              const amount = parseFloat(tx.amount || tx.referral_earnings_for_ticket || tx.referral_revenue || 0);

              // Label: prefer description, then event name
              const label = tx.description 
                || (tx.event_name ? `Commission: ${tx.event_name}` : "")
                || (type === "payouts" ? `Payout: ${id.slice(0, 15)}...` : "Referral Reward");

              // Type label
              const typeLabel = tx.transaction_type_display 
                || (tx.type === "ticket_sale" ? "Ticket Sale" : tx.type)
                || (type === "payouts" ? "Withdrawal" : "Referral Reward");

              return (
                <tr key={id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        {getIcon(tx.transaction_type || tx.type || (type === "payouts" ? "withdrawal" : "referral_reward"))}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight leading-none mb-1.5 group-hover:text-primary transition-colors">
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">
                          {formatDate(date)}
                        </p>
                        {type === "payouts" && tx.admin_notes && (
                           <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5 max-w-[240px]">
                              <AlertCircle size={10} className="text-primary shrink-0 mt-0.5" />
                              <p className="text-[10px] text-gray-400 font-medium italic leading-snug">"{tx.admin_notes}"</p>
                           </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <p className="text-xs font-bold text-gray-400 capitalize tracking-wide">
                        {typeLabel}
                     </p>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex justify-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          getStatusColor(status)
                        )}>
                          {status}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <p className={cn(
                       "text-sm font-extrabold tracking-tight",
                       (type === "earnings") ? "text-green-500" : "text-white"
                     )}>
                       {type === "earnings" ? "+" : "-"}₦{amount.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                     </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
