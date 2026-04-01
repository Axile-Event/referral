"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  CreditCard, 
  ChevronRight,
  Camera,
  Mail,
  Lock,
  Globe,
  Trash2,
  Save,
  Check,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const SETTINGS_TABS = [
  { id: "profile", name: "Profile", icon: User, description: "Account & Security" },
  { id: "billing", name: "Billing", icon: CreditCard, description: "Manage subscriptions" },
];

export default function SettingsPage() {
  const { user, fetchProfile, updateProfile, isLoading, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.Firstname || user.firstname || "",
        lastname: user.Lastname || user.lastname || "",
        email: user.email || "",
        password: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      // API expects capitalized fields from legacy requirements but handle both
      await updateProfile({
        Firstname: formData.firstname,
        Lastname: formData.lastname,
        Password: formData.password || undefined
      });
      
      toast.success("Profile updated successfully!", {
        style: {
          background: "#161622",
          color: "#fff",
          border: "1px solid rgba(227, 54, 41, 0.2)"
        }
      });
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 pt-4 px-4 sm:px-0">
      
      <div className="space-y-3">
         <h1 className="text-3xl font-medium tracking-tight text-white/95">Account Settings</h1>
         <p className="text-white/40 text-sm font-medium">Configure your personal preferences and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-2 relative">
           <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.04] hidden lg:block" />
           
           {SETTINGS_TABS.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`
                   relative flex items-center gap-4 px-6 py-4 text-left transition-all duration-300 group rounded-2xl lg:rounded-none
                   ${isActive ? "text-white bg-white/[0.03] lg:bg-transparent" : "text-white/40 hover:text-white/70 hover:bg-white/[0.02] lg:hover:bg-transparent"}
                 `}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="active-tab"
                     className="absolute left-0 top-2 bottom-2 w-1 bg-primary shadow-[4px_0_12px_rgba(227,54,41,0.5)] rounded-r-full hidden lg:block"
                   />
                 )}
                 <tab.icon size={20} className={`${isActive ? "text-primary" : "group-hover:text-white/60"} transition-colors`} />
                 <div className="flex flex-col">
                   <span className="text-sm font-bold tracking-wide uppercase">{tab.name}</span>
                   <span className="text-[11px] font-medium opacity-50 truncate max-w-[160px]">{tab.description}</span>
                 </div>
                 {isActive && <ChevronRight size={14} className="ml-auto text-primary" />}
               </button>
             );
           })}
        </nav>

        {/* Content Area */}
        <div className="bg-[#12121f] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative min-h-[550px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="p-6 md:p-12 space-y-10"
             >
                {activeTab === "profile" && (
                  <ProfileSettings 
                    user={user} 
                    formData={formData} 
                    onChange={handleChange} 
                    onSave={handleSave} 
                    isSaving={isSaving} 
                  />
                )}
                {activeTab === "billing" && <BillingSettings />}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="space-y-1.5 border-b border-white/[0.03] pb-6 mb-8">
       <h3 className="text-xl font-bold text-white/90 tracking-tight">{title}</h3>
       <p className="text-[13px] text-white/40 font-medium">{subtitle}</p>
    </div>
  );
}

function ProfileSettings({ user, formData, onChange, onSave, isSaving }) {
  return (
    <div className="space-y-12">
       {/* Account Info Section */}
       <div className="space-y-8">
          <SectionHeader title="Account Details" subtitle="Update your identity and contact information." />
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
             <div className="relative group self-center md:self-start">
                <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-lg">
                   {user?.profile_image ? (
                     <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User size={48} className="text-white/20" />
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer text-white">
                      <Camera size={20} />
                   </div>
                </div>
             </div>

             <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">First Name</label>
                      <Input 
                        name="firstname"
                        value={formData.firstname}
                        onChange={onChange}
                        className="bg-white/[0.04] border-white/5 rounded-2xl h-12 focus:border-primary/50" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Last Name</label>
                      <Input 
                        name="lastname"
                        value={formData.lastname}
                        onChange={onChange}
                        className="bg-white/[0.04] border-white/5 rounded-2xl h-12 focus:border-primary/50" 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <Input 
                    disabled
                    value={formData.email}
                    className="bg-white/[0.02] border-white/5 rounded-2xl h-12 opacity-50 cursor-not-allowed" 
                  />
                  <p className="text-[10px] text-white/20 ml-1">Email cannot be changed after verification.</p>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">New Password</label>
                   <Input 
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="••••••••••••" 
                    className="bg-white/[0.04] border-white/5 rounded-2xl h-12 focus:border-primary/50" 
                   />
                   <p className="text-[10px] text-white/20 ml-1">Leave blank to keep your current password.</p>
                </div>
             </div>
          </div>
       </div>

       {/* PIN Section - New */}
       <div className="space-y-8 pt-4">
          <SectionHeader title="Withdrawal PIN" subtitle="Required for all high-value wallet transactions and payouts." />
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all">
             <div className="space-y-2 max-w-sm">
                <div className="flex items-center gap-3">
                   <Lock className="text-primary" size={20} />
                   <h4 className="font-bold text-white uppercase tracking-tight">Security PIN</h4>
                </div>
                <p className="text-[12px] text-white/40 font-medium leading-relaxed">Secure your earnings. Set a 4-6 digit numeric PIN to authorize your cash withdrawals.</p>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Input type="password" maxLength={6} placeholder="SET PIN" className="w-full sm:w-32 bg-black/40 border-white/10 text-center tracking-[0.5em] font-bold h-12 rounded-xl" />
                <Button className="w-full sm:w-auto bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                   Configure
                </Button>
             </div>
          </div>
       </div>

       {/* Save Button */}
       <div className="pt-8 flex justify-end border-t border-white/5">
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-10 font-bold transition-all active:scale-95 flex items-center gap-3"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "Synchronizing..." : "Apply All Settings"}
          </Button>
       </div>

       {/* Danger area at the very bottom since everything is on one tab */}
       <div className="pt-20 space-y-6">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] text-center italic">Account Obsolescence</p>
          <div className="p-8 border border-red-500/10 bg-red-500/[0.01] rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-red-500/[0.03] transition-all">
             <div className="text-center md:text-left space-y-2">
                <h4 className="font-bold text-white/80 uppercase tracking-tight text-sm">Delete Account</h4>
                <p className="text-[11px] text-white/20 font-medium max-w-[280px]">Permanently remove all your campaigns, earnings history, and identity.</p>
             </div>
             <Button className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest">
                Confirm Deletion
             </Button>
          </div>
       </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-8">
       <div className="relative">
          <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/20">
             <CreditCard size={44} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 bg-yellow-500 w-4 h-4 rounded-full border-4 border-[#12121f]" />
       </div>
       <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Payout Methods</h2>
          <p className="text-white/40 text-[14px] max-w-sm mx-auto leading-relaxed">Default payouts are processed via the Axile Unified Wallet. Add a secondary method for rapid withdrawals.</p>
       </div>
       <Button variant="outline" className="border-white/10 hover:border-primary/50 text-white rounded-2xl px-12 h-14 font-black text-[10px] tracking-widest uppercase">
          Connect External Method
       </Button>
    </div>
  );
}
