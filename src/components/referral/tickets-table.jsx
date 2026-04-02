"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils"; // Assume some formatter, or we just format inline
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export function TicketsTable({ tickets = [] }) {
  // Sort tickets by most recent first. 
  // Assuming 'date' or similar field exists. If not, just display order they come in.
  const sortedTickets = [...tickets].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return 0; // fallback if no date
  });

  const getStatusIcon = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "paid") {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (s === "pending") {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    if (s === "failed" || s === "cancelled") {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-primary" />;
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "paid") return "text-green-500 bg-green-500/10";
    if (s === "pending") return "text-yellow-500 bg-yellow-500/10";
    if (s === "failed" || s === "cancelled") return "text-red-500 bg-red-500/10";
    return "text-primary bg-primary/10";
  };

  const maskBuyer = (buyerDetails) => {
    if (!buyerDetails) return "Anonymous";
    // Check if it's an email
    if (buyerDetails.includes("@")) {
      const parts = buyerDetails.split("@");
      if (parts[0].length > 3) {
        return `${parts[0].substring(0, 3)}***@${parts[1]}`;
      }
      return `***@${parts[1]}`;
    }
    // If it's a name or ID
    if (buyerDetails.length > 5) {
      return `${buyerDetails.substring(0, 5)}...`;
    }
    return "Anonymous";
  };

  return (
    <div className="w-full overflow-hidden bg-[#0a0a14] border border-white/10 rounded-2xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 uppercase tracking-wider text-[11px] font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">Ticket Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Buyer</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedTickets.map((ticket, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-5 font-medium text-white">
                  {ticket.category_name || "General Admission"}
                </td>
                <td className="px-6 py-5 text-gray-300 font-mono">
                  {ticket.category_price ? `₦${Number(ticket.category_price).toLocaleString()}` : "--"}
                </td>
                <td className="px-6 py-5 text-gray-400">
                  {maskBuyer(ticket.buyer_details || ticket.buyer)}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {typeof ticket.status === "string" ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : "Completed"}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
