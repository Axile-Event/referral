"use client";

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Fingerprint,
  LogOut, 
  Eye,
  EyeOff,
  UserCircle,
  AtSign,
  KeyRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/ui/otp-input";
import toast from "react-hot-toast";

const toastTheme = {
  style: {
    background: "#161622",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    fontSize: "13px",
  },
};

export default function SettingsPage() {
  const { user: profile, fetchProfile, updateProfile, logout, changePassword, setPin } = useAuthStore();
  const isLoading = useAuthStore(state => state.isLoading);

  // Profile/Username state
  const [usernameVal, setUsernameVal] = useState("");

  // Password Update
  const [showPass, setShowPass] = useState(false);
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });

  // PIN Setup
  const [pinData, setPinData] = useState({ pin: "", confirm: "" });

  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
        setUsernameVal(profile.username || profile.Username || "");
    }
  }, [profile]);

  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 4);

  // Determine if they actually have a set username vs a default email placeholder
  const hasExistingUsername = profile ? Boolean((profile.username || profile.Username) && (profile.username !== profile.email) && !(profile.username || "").includes('@') && !profile.needs_username) : false;

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (hasExistingUsername) return; // safety catch
    if (!usernameVal) return toast.error("Username is required", toastTheme);
    
    try {
      await updateProfile({ username: usernameVal });
      // After success, it will update profile state and disable the field if successful
      toast.success("Username set successfully!", toastTheme);
    } catch (err) {
      console.error("Settings: Username update failed", err.response?.data || err.message);
      const errorData = err.response?.data;
      const msg = errorData?.username?.[0] || 
                  errorData?.Username?.[0] ||
                  errorData?.error || 
                  errorData?.detail ||
                  "Failed to set username";
      toast.error(msg, toastTheme);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passData.old || !passData.new) return toast.error("Old and new passwords are required", toastTheme);
    if (passData.new !== passData.confirm) return toast.error("Passwords do not match", toastTheme);
    try {
      const success = await changePassword(passData.old, passData.new);
      if (success) {
        toast.success("Password updated successfully!", toastTheme);
        setPassData({ old: "", new: "", confirm: "" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.response?.data?.detail || "Failed to update password";
      toast.error(msg, toastTheme);
    }
  };

  const handlePinSetup = async (e) => {
    e.preventDefault();
    if (pinData.pin.length !== 4) return toast.error("PIN must be exactly 4 digits", toastTheme);
    if (pinData.pin !== pinData.confirm) return toast.error("PINs do not match", toastTheme);
    
    try {
      // Call setPin endpoint (/referee/pin/ with { "pin": "..." })
      const success = await setPin(pinData.pin);
      if (success) {
        toast.success("PIN set successfully!", toastTheme);
        setPinData({ pin: "", confirm: "" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.response?.data?.detail || "Failed to set PIN";
      toast.error(msg, toastTheme);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 pt-8 px-4 sm:px-6 w-full relative z-10">
      
      {/* ─── HEADER AREA ─── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-row items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-white/40 text-xs sm:text-sm font-medium mt-1">Manage security & preferences.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => logout(localStorage.getItem("axile_refresh"))}
          disabled={isLoading}
          className="group border-white/10 bg-white/5 hover:bg-white hover:text-black rounded-lg h-9 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all"
        >
          <LogOut size={14} className="sm:mr-2 mr-0 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </motion.div>

      {/* ─── UNIFIED SETTINGS CARD ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#12121f]/90 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden divide-y divide-white/5"
      >
        {/* ─── 1. SET USERNAME ─── */}
        <div className="p-5 sm:p-7 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <UserCircle size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Profile Username</h2>
              <p className={`text-[11px] sm:text-xs font-medium ${hasExistingUsername ? "text-emerald-400" : "text-white/40"}`}>
                {hasExistingUsername ? "✓ You already have a username set." : "Set a unique username for your account."}
              </p>
            </div>
          </div>

          <form onSubmit={handleUsernameSubmit} className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="w-full sm:w-64 relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                <AtSign size={16} />
              </div>
              <Input 
                placeholder="New Username"
                value={usernameVal}
                disabled={hasExistingUsername}
                onChange={e => setUsernameVal(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className={`bg-black/20 border-white/5 h-11 rounded-xl pl-10 font-bold text-sm text-white ${hasExistingUsername ? 'opacity-50 cursor-not-allowed text-white/50' : 'focus:border-blue-500/50'}`}
              />
            </div>
            <Button type="submit" disabled={isLoading || hasExistingUsername} className={`h-11 px-6 rounded-xl font-bold text-[11px] uppercase tracking-wider text-white transition-all w-full sm:w-auto shrink-0 shadow-sm ${hasExistingUsername ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' : 'bg-blue-600 hover:bg-blue-500'}`}>
              {hasExistingUsername ? "Locked" : "Set Username"}
            </Button>
          </form>
        </div>

        {/* ─── 2. CHANGE PASSWORD ─── */}
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <KeyRound size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Change Password</h2>
              <p className="text-[11px] sm:text-xs text-white/40 font-medium">Update your account password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                <Lock size={16} />
              </div>
              <Input 
                type={showPass ? "text" : "password"} 
                placeholder="Old Password" 
                value={passData.old}
                onChange={e => setPassData({...passData, old: e.target.value})}
                className="bg-black/20 border-white/5 h-11 rounded-xl focus:border-rose-500/50 pl-10 pr-10 font-medium text-sm text-white"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input 
                type="password" 
                placeholder="New Password" 
                value={passData.new}
                onChange={e => setPassData({...passData, new: e.target.value})}
                className="bg-black/20 border-white/5 h-11 rounded-xl focus:border-rose-500/50 font-medium text-sm text-white px-4"
              />
              <Input 
                type="password" 
                placeholder="Confirm Password" 
                value={passData.confirm}
                onChange={e => setPassData({...passData, confirm: e.target.value})}
                className="bg-black/20 border-white/5 h-11 rounded-xl focus:border-rose-500/50 font-medium text-sm text-white px-4"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isLoading} className="h-11 px-6 rounded-xl font-bold text-[11px] uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white transition-all w-full sm:w-auto shadow-sm">
                 Change Password
              </Button>
            </div>
          </form>
        </div>

        {/* ─── 3. SET PIN ─── */}
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg ${profile?.has_pin || profile?.pin_set || useAuthStore.getState().pinHash ? "bg-emerald-500/20 text-emerald-500" : "bg-emerald-500/10 text-emerald-500"} flex items-center justify-center shrink-0`}>
              <Fingerprint size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Security PIN</h2>
              <p className={`text-[11px] sm:text-xs font-medium ${(profile?.has_pin || profile?.pin_set || useAuthStore.getState().pinHash) ? "text-emerald-400" : "text-white/40"}`}>
                {(profile?.has_pin || profile?.pin_set || useAuthStore.getState().pinHash) ? "✓ Your security PIN is active." : "Create a secure 4-digit numeric code."}
              </p>
            </div>
          </div>

          {(profile?.has_pin || profile?.pin_set || useAuthStore.getState().pinHash) ? (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest">PIN setup complete</span>
               </div>
               <Button 
                variant="ghost" 
                onClick={() => toast.error("PIN updates are coming soon", toastTheme)}
                className="text-[10px] font-bold text-white/20 hover:text-white/40 uppercase tracking-widest px-0"
               >
                 Change?
               </Button>
            </div>
          ) : (
            <form onSubmit={handlePinSetup} className="flex flex-col gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">New 4-digit PIN</p>
                <OTPInput 
                  length={4} 
                  value={pinData.pin}
                  onChange={v => setPinData({...pinData, pin: v})}
                  centered={false}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Confirm PIN</p>
                <OTPInput 
                  length={4} 
                  value={pinData.confirm}
                  onChange={v => setPinData({...pinData, confirm: v})}
                  centered={false}
                  size="sm"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl font-bold text-[11px] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-white transition-all w-full sm:w-auto shadow-sm">
                   Set PIN
                </Button>
              </div>
            </form>
          )}
        </div>

      </motion.div>
    </div>
  );
}
