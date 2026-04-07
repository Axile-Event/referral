import { useEffect, useState } from "react";
import { 
  X, 
  ArrowRight, 
  Building,
  User as UserIcon,
  CreditCard,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletStore } from "@/store/walletStore";
import { toast } from "react-hot-toast";

/**
 * AddBankModal Component
 * Now with dynamic bank fetching and persistent naming
 */
export function AddBankModal({ isOpen, onClose }) {
  const { fetchBanks, banks, updateBankDetails } = useWalletStore();
  const [bankData, setBankData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { verifyBankAccount } = useWalletStore();

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen, fetchBanks]);

  // Auto-verify when 10 digits and bankCode are present
  useEffect(() => {
    const triggerVerify = async () => {
      if (bankData.accountNumber.length === 10 && bankData.bankCode) {
        setIsVerifying(true);
        try {
          const res = await verifyBankAccount(bankData.accountNumber, bankData.bankCode);
          if (res.success && res.accountName) {
            setBankData(prev => ({ ...prev, accountName: res.accountName }));
            toast.success("Account name detected");
          } else {
            setBankData(prev => ({ ...prev, accountName: "" }));
            toast.error(res.error || "Could not detect account name");
          }
        } catch (err) {
          setBankData(prev => ({ ...prev, accountName: "" }));
          toast.error("Bank verification failed");
        } finally {
          setIsVerifying(false);
        }
      }
    };
    triggerVerify();
  }, [bankData.accountNumber, bankData.bankCode, verifyBankAccount]);

  const filteredBanks = Array.isArray(banks) ? banks.filter(bank => 
    (bank.name || bank.bank_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const isValid = 
    bankData.accountName.trim().length > 3 && 
    bankData.accountNumber.length === 10 && 
    bankData.bankName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const res = await updateBankDetails(bankData);
      if (res.success) {
        toast.success("Bank account linked successfully!");
        onClose();
      } else {
        toast.error(res.error || "Failed to link bank account");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankSelect = (bank) => {
    const name = bank.name || bank.bank_name;
    const code = bank.code || bank.bank_code || bank.id || "";
    setBankData(prev => ({ 
      ...prev, 
      bankName: name,
      bankCode: code
    }));
    setSearchQuery(name);
    setShowDropdown(false);
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
        <div className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50">
                    <Building size={20} />
                 </div>
                 <h3 className="text-xl font-semibold text-white tracking-tight">Bank Details</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                 <X size={20} />
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="space-y-2 relative">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Bank</label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                       <Building size={18} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search bank name..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-12 text-white font-medium focus:border-white/20 outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>
                 </div>

                 <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#1a1c29] border border-white/10 rounded-2xl shadow-2xl max-h-56 overflow-y-auto z-50 py-2"
                      >
                         {filteredBanks.length > 0 ? (
                            filteredBanks.map((bank, idx) => (
                               <button
                                 key={idx}
                                 type="button"
                                 onClick={() => handleBankSelect(bank)}
                                 className="w-full px-5 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                               >
                                  {bank.name || bank.bank_name}
                               </button>
                            ))
                         ) : (
                            <div className="px-5 py-4 text-sm text-gray-500 font-medium">No banks found</div>
                         )}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Account Holder Name</label>
                 <div className="relative group">
                    <Input 
                      name="accountName"
                      placeholder="Verified name will appear here..." 
                      icon={UserIcon}
                      value={bankData.accountName}
                      onChange={(e) => setBankData(prev => ({ ...prev, accountName: e.target.value }))}
                      className={`h-14 rounded-2xl bg-white/5 border-white/10 ${isVerifying ? 'opacity-50' : 'group-hover:border-primary/50'}`}
                      disabled={isVerifying}
                      readOnly={!!bankData.accountName} // Make it read-only once verified
                    />
                    {isVerifying && (
                       <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="animate-spin text-primary" size={18} />
                       </div>
                    )}
                 </div>
                 <p className="text-[10px] text-gray-500 px-1 italic">
                    {bankData.accountName ? "✓ Legal owner verified by bank" : "Provide account details to reveal official name."}
                 </p>
              </div>

              <div className="pt-4">
                 <Button 
                   type="submit" 
                   size="lg" 
                   className="w-full h-14 rounded-2xl font-bold text-base group bg-primary hover:bg-primary/90 text-white"
                   disabled={!isValid || isSubmitting}
                 >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : "Link Bank Account"}
                 </Button>
              </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
}
