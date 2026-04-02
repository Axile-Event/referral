import { useState } from "react";
import { 
  X, 
  ArrowRight, 
  AlertCircle,
  PiggyBank
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WithdrawModal Component
 */
export function WithdrawModal({ isOpen, onClose, balance = 0, onWithdraw }) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = Number(amount) >= 500 && Number(amount) <= balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onWithdraw(Number(amount));
      onClose();
    } catch (err) {
      console.error(err);
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

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-baseline px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Amount (₦)</label>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 tracking-widest">
                       Min: ₦500
                    </span>
                 </div>
                 <div className="relative group">
                    <Input 
                       type="number"
                       placeholder="0.00"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       className="text-center text-3xl font-extrabold h-24 rounded-3xl bg-white/5 border-white/10 focus-visible:ring-primary/50"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</div>
                 </div>
                 <div className="flex justify-between items-center px-2 py-1">
                    <p className="text-sm font-medium text-gray-400">
                       You receive: <span className="text-white font-bold tracking-tight">₦{(Number(amount) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                    </p>
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
                 <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-gray-400 leading-normal">
                    Funds will be sent to your primary linked bank account. 
                    Processing may take up to 24-48 business hours.
                 </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-2xl font-bold text-base group"
                disabled={!isValid || isSubmitting}
              >
                 {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
                 {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
