"use client";

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Eye,
  EyeOff,
  Shield,
  Fingerprint,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const toastTheme = {
  style: {
    background: "#161622",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    fontSize: "13px",
  },
};

export default function SettingsPage() {
  const { user: profile, fetchProfile, updateProfile, logout, changePassword, setPin } = useAuthStore();
  const isLoading = useAuthStore(state => state.isLoading);

  // Profile/Username state
  const [userData, setUserData] = useState({ username: "", firstname: "", lastname: "" });

  useEffect(() => {
    const loadData = async () => {
      const p = await fetchProfile();
      console.log("DEBUG: SettingsPage Profile Load:", p);
      if (p) {
        setUserData({
          username: p.username || p.Username || "",
          firstname: p.Firstname || p.firstname || "",
          lastname: p.Lastname || p.lastname || ""
        });
      }
    };
    loadData();
  }, [fetchProfile]);

  // Password Update
  const [showPass, setShowPass] = useState(false);
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });

  // PIN Setup
  const [pinVal, setPinVal] = useState("");

  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 4);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!userData.username) return toast.error("Public Handle/Username is required for referral tracking", toastTheme);
    await updateProfile(userData);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passData.old || !passData.new) return toast.error("All fields are required", toastTheme);
    if (passData.new !== passData.confirm) return toast.error("Passwords do not match", toastTheme);
    const success = await changePassword(passData.old, passData.new);
    if (success) setPassData({ old: "", new: "", confirm: "" });
  };

  const handlePinSetup = async (e) => {
    e.preventDefault();
    if (pinVal.length !== 4) return toast.error("PIN must be exactly 4 digits", toastTheme);
    const success = await setPin(pinVal);
    if (success) setPinVal("");
  };

  return (
    <div className="max-w-3xl mx-auto pb-32 pt-10 px-4 sm:px-0 animate-fade-in space-y-10">
      
      {/* ─── HEADER AREA ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-white/30 text-sm font-medium mt-1">Manage security and account preferences.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => logout(localStorage.getItem("axile_refresh"))}
          disabled={isLoading}
          className="border-white/10 hover:bg-white hover:text-black rounded-xl h-10 px-5 text-xs font-bold uppercase tracking-widest transition-all"
        >
          <LogOut size={14} className="mr-2" />
          Logout
        </Button>
      </div>

      <div className="bg-[#12121f] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl divide-y divide-white/[0.04]">
        
        {/* ─── PROFILE IDENTITY SECTION ─── */}
        <section className="p-8 md:p-10 space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <UserCircle size={20} />
              </div>
              <div className="flex-1">
                 <h2 className="text-lg font-bold text-white tracking-tight italic">Account Identity</h2>
                 <p className="text-xs text-white/30 font-medium">This is how you will be identified on referral links and the leaderboard</p>
              </div>
           </div>

           <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Referral Handle (Username)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold text-lg">@</span>
                    <Input 
                      placeholder="e.g. samkiel"
                      value={userData.username}
                      onChange={e => setUserData({ ...userData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                      className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-rose-500/40 pl-10 font-bold text-lg"
                    />
                  </div>
                  <p className="text-[10px] text-white/20 ml-2">Must be lowercase letters and numbers only.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">First Name</label>
                  <Input 
                    placeholder="First Name"
                    value={userData.firstname}
                    onChange={e => setUserData({ ...userData, firstname: e.target.value })}
                    className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-primary/40 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Last Name</label>
                  <Input 
                    placeholder="Last Name"
                    value={userData.lastname}
                    onChange={e => setUserData({ ...userData, lastname: e.target.value })}
                    className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-primary/40 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                 <Button type="submit" disabled={isLoading} className="h-12 px-10 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-rose-500 hover:bg-rose-400">
                    {isLoading ? "Saving..." : "Save Identity"}
                 </Button>
              </div>
           </form>
        </section>
        {/* ─── PASSWORD SECTION (GROUPED) ─── */}
        <section className="p-8 md:p-10 space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={20} />
              </div>
              <div className="flex-1">
                 <h2 className="text-lg font-bold text-white tracking-tight">Change Password</h2>
                 <p className="text-xs text-white/30 font-medium">Update your account login credentials</p>
              </div>
           </div>

           <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative md:col-span-2">
                 <Input 
                   type={showPass ? "text" : "password"} 
                   placeholder="Current Password" 
                   value={passData.old}
                   onChange={e => setPassData({...passData, old: e.target.value})}
                   className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-primary/40 pr-12 font-medium"
                 />
                 <button 
                   type="button" 
                   onClick={() => setShowPass(!showPass)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                 >
                   {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>

              <Input 
                type="password" 
                placeholder="New Password" 
                value={passData.new}
                onChange={e => setPassData({...passData, new: e.target.value})}
                className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-primary/40 font-medium"
              />
              <Input 
                type="password" 
                placeholder="Confirm Password" 
                value={passData.confirm}
                onChange={e => setPassData({...passData, confirm: e.target.value})}
                className="bg-white/[0.03] border-white/5 h-12 rounded-xl focus:border-primary/40 font-medium"
              />

              <div className="md:col-span-2 flex justify-end pt-2">
                 <Button type="submit" disabled={isLoading} className="h-12 px-10 rounded-xl font-bold text-xs uppercase tracking-widest">
                    {isLoading ? "Saving..." : "Update Password"}
                 </Button>
              </div>
           </form>
        </section>

        {/* ─── PIN SECTION (GROUPED) ─── */}
        <section className="p-8 md:p-10 space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Fingerprint size={20} />
              </div>
              <div className="flex-1">
                 <h2 className="text-lg font-bold text-white tracking-tight italic">Security PIN</h2>
                 <p className="text-xs text-white/30 font-medium">Create a 4-digit code for withdrawal authorization</p>
              </div>
           </div>

           <form onSubmit={handlePinSetup} className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
              <div className="w-full sm:flex-1 space-y-2">
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1 italic">Setup Access PIN</label>
                 <Input 
                   type="password" 
                   maxLength={4} 
                   placeholder="••••" 
                   value={pinVal}
                   onChange={e => setPinVal(onlyDigits(e.target.value))}
                   className="bg-black/40 border-primary/20 h-16 w-full text-center text-3xl tracking-[0.8em] font-black rounded-2xl focus:border-primary transition-all shadow-inner"
                 />
              </div>
              <Button type="submit" disabled={isLoading} className="h-16 w-full sm:w-auto px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-white text-black hover:bg-neutral-200 transition-all shadow-lg active:scale-95">
                 {isLoading ? "Validating..." : "Initialize PIN"}
              </Button>
           </form>
        </section>

      </div>
    </div>
  );
}
