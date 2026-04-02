import { useState } from "react";
import { 
  X, 
  ArrowRight, 
  Building,
  User as UserIcon,
  CreditCard,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AddBankModal Component
 */
export function AddBankModal({ isOpen, onClose, onSubmit }) {
  const [bankData, setBankData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = bankData.accountName && bankData.accountNumber.length >= 10 && bankData.bankName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(bankData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankData(prev => ({ ...prev, [name]: value }));
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
                    <Building size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-white tracking-tight">Add Bank Account</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                 <X size={20} />
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Account Holder Name</label>
                 <Input 
                   name="accountName"
                   placeholder="Full Legal Name" 
                   icon={UserIcon}
                   value={bankData.accountName}
                   onChange={handleChange}
                   className="h-14 rounded-2xl bg-white/5 border-white/10"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Bank</label>
                 <select 
                   name="bankName"
                   value={bankData.bankName}
                   onChange={handleChange}
                   className="w-full h-14 rounded-2xl bg-[#12121f] border border-white/10 px-4 text-white font-medium focus:ring-1 focus:ring-primary outline-none transition-all"
                 >
                    <option value="" className="bg-[#0a0a14]">Choose Bank</option>
                    <option value="GTBank" className="bg-[#0a0a14]">GTBank</option>
                    <option value="Zenith" className="bg-[#0a0a14]">Zenith Bank</option>
                    <option value="Kuda" className="bg-[#0a0a14]">Kuda Microfinance</option>
                    <option value="Access" className="bg-[#0a0a14]">Access Bank</option>
                    <option value="UBA" className="bg-[#0a0a14]">UBA</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Account Number</label>
                 <Input 
                    name="accountNumber"
                    placeholder="10-digit number"
                    type="text"
                    maxLength={10}
                    icon={CreditCard}
                    value={bankData.accountNumber}
                    onChange={(e) => {
                       const value = e.target.value.replace(/\D/g, "");
                       setBankData(prev => ({ ...prev, accountNumber: value }));
                    }}
                    className="h-14 rounded-2xl bg-white/5 border-white/10"
                 />
              </div>

              <div className="pt-4">
                 <Button 
                   type="submit" 
                   size="lg" 
                   className="w-full h-14 rounded-2xl font-bold text-base group"
                   disabled={!isValid || isSubmitting}
                 >
                    {isSubmitting ? "Linking..." : (
                       <>
                          Link Bank Account <Plus size={18} className="ml-2 group-hover:scale-125 transition-transform" />
                       </>
                    )}
                 </Button>
              </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
