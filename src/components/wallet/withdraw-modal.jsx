import { useState } from "react";
import { 
  X, 
  ArrowRight, 
  AlertCircle,
  PiggyBank,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletStore } from "@/store/walletStore";
import { toast } from "react-hot-toast";

/**
 * WithdrawModal Component
 */
export function WithdrawModal({ isOpen, onClose, availableBalance: propBalance }) {
  const { availableBalance: storeBalance, withdraw, hasBankAccount } = useWalletStore();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBalance = propBalance !== undefined ? propBalance : storeBalance;

  const minAmount = 1000;
  // Strip commas before calculating the numerical value
  const numAmount = Number(amount.replace(/,/g, '')) || 0;
  const isValid = numAmount >= minAmount && numAmount <= availableBalance && hasBankAccount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const res = await withdraw(numAmount);
      if (res.success) {
        toast.success(res.message || "Withdrawal request submitted!");
        onClose();
      } else {
        toast.error(res.error || "Withdrawal failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#0a0a14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <PiggyBank size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white tracking-tight">Withdraw Funds</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                 <X size={20} />
              </button>
           </div>

           {!hasBankAccount && (
             <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start animate-pulse">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-500 font-medium leading-normal">
                   Please link a bank account before you can request a withdrawal.
                </p>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-baseline px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (₦)</label>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 tracking-widest uppercase">
                       Min: ₦{minAmount.toLocaleString()}
                    </span>
                 </div>
                 <div className="relative group">
                    <Input 
                       type="text"
                       placeholder="0.00"
                       value={amount}
                       onChange={(e) => {
                          // Allow only numbers and decimal
                          const raw = e.target.value.replace(/[^0-9.]/g, '');
                          if (raw.split('.').length > 2) return; // Prevent multiple decimals
                          const parts = raw.split('.');
                          if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          setAmount(parts.join('.'));
                       }}
                       className={`text-center text-3xl font-extrabold h-24 rounded-3xl bg-white/5 border-white/10 focus-visible:ring-primary/50 ${!isValid && numAmount > 0 ? 'text-red-400' : ''}`}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</div>
                 </div>
                 <div className="flex justify-between items-center px-2 py-1">
                    <p className="text-sm font-medium text-gray-400">
                       Max: <span className="text-white font-bold">₦{availableBalance.toLocaleString()}</span>
                    </p>
                    {numAmount > availableBalance && (
                        <p className="text-[10px] text-red-500 font-bold uppercase">Insufficient Balance</p>
                    )}
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3 items-start">
                 <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
                 <p className="text-xs text-gray-400 leading-normal">
                    Funds will be sent to your verified bank account. 
                    Processing typically takes 24-48 hours.
                 </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-2xl font-bold text-base group mt-2"
                disabled={!isValid || isSubmitting}
              >
                 {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                 ) : (
                    <>
                       Request Payout <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                 )}
              </Button>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
