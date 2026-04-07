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
  KeyRound,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinInputBox } from "@/components/ui/pin-input-box";
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
  const { user: profile, fetchProfile, updateProfile, logout, changePassword, setPin, authMethod } = useAuthStore();
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

  // Clear PIN form when has_pin becomes true
  useEffect(() => {
    if (profile?.has_pin) {
      setPinData({ pin: "", confirm: "" });
    }
  }, [profile?.has_pin]);

  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 4);

  const currentUsername = profile?.username || profile?.Username || "";
  const currentEmail = profile?.email || profile?.Email || "";
  const isDefaultUsername = (currentUsername === profile?.email) || (currentUsername || "").includes('@') || profile?.needs_username;
  
  // Determine if user authenticated via Google
  const isGoogleUser = authMethod === "google";
  
  // Username is locked for Google users after they've set it (username is not blank)
  const isUsernameLocked = isGoogleUser && currentUsername && !isDefaultUsername;

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!usernameVal) return toast.error("Username is required", toastTheme);
    if (usernameVal === currentUsername && !isDefaultUsername) {
      return toast.error("Please choose a different username", toastTheme);
    }
    
    try {
      await updateProfile({ username: usernameVal });
      toast.success("Username updated successfully!", toastTheme);
    } catch (err) {
      const msg = err.response?.data?.username?.[0] || err.response?.data?.error || "Failed to update username";
      toast.error(msg, toastTheme);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passData.old || !passData.new) return toast.error("Old and new passwords are required", toastTheme);
    if (passData.new !== passData.confirm) return toast.error("Passwords do not match", toastTheme);
    const success = await changePassword(passData.old, passData.new);
    if (success) {
      toast.success("Password updated successfully!", toastTheme);
      setPassData({ old: "", new: "", confirm: "" });
    }
  };

  const handlePinSetup = async (e) => {
    e.preventDefault();
    if (pinData.pin.length !== 4) return toast.error("PIN must be exactly 4 digits", toastTheme);
    if (pinData.pin !== pinData.confirm) return toast.error("PINs do not match", toastTheme);
    
    // Call setPin endpoint - it now handles profile refresh internally
    const success = await setPin(pinData.pin);
    if (success) {
      toast.success("PIN set successfully!", toastTheme);
      setPinData({ pin: "", confirm: "" });
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
        {/* ─── 1. EMAIL ADDRESS ─── */}
        <div className="p-5 sm:p-7 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <AtSign size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Email Address</h2>
              <p className="text-[11px] sm:text-xs text-white/40 font-medium">
                {isGoogleUser ? "Managed by Google authentication" : "Your account email"}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-96 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <AtSign size={16} />
            </div>
            <Input 
              placeholder="Email"
              value={currentEmail}
              disabled={true}
              className="bg-black/20 border-white/5 h-11 rounded-xl pl-10 font-medium text-sm text-white cursor-not-allowed"
            />
          </div>
        </div>

        {/* ─── 2. SET USERNAME ─── */}
        <div className="p-5 sm:p-7 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <UserCircle size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Profile Username</h2>
              <p className={`text-[11px] sm:text-xs font-medium ${!isDefaultUsername ? "text-emerald-400" : "text-white/40"}`}>
                {isUsernameLocked ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Lock size={12} /> Username is locked (set at signup)
                  </span>
                ) : !isDefaultUsername ? (
                  "Update your unique username."
                ) : (
                  "Set a unique username for your account."
                )}
                {!isDefaultUsername && !isUsernameLocked && (
                  <span className="block text-white/20 mt-1 uppercase text-[9px] font-black tracking-tighter">
                    Changing will break old referral links
                  </span>
                )}
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
                onChange={e => setUsernameVal(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                disabled={isLoading || isUsernameLocked}
                className="bg-black/20 border-white/5 h-11 rounded-xl pl-10 font-bold text-sm text-white focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || (usernameVal === currentUsername && !isDefaultUsername) || isUsernameLocked} 
              className="h-11 px-6 rounded-xl font-bold text-[11px] uppercase tracking-wider text-white transition-all w-full sm:w-auto shrink-0 shadow-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isDefaultUsername ? "Update Username" : "Set Username"}
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
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${profile?.has_pin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {profile?.has_pin ? <CheckCircle size={16} /> : <Fingerprint size={16} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">{profile?.has_pin ? 'PIN Set' : 'Set PIN'}</h2>
              <p className="text-[11px] sm:text-xs text-white/40 font-medium">
                {profile?.has_pin ? 'Your PIN is secure and active.' : 'Create a secure 4-digit numeric code.'}
              </p>
            </div>
          </div>

          {profile?.has_pin ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">PIN successfully set</p>
                  <p className="text-xs text-white/60 mt-1">You can use your PIN for secure transactions.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePinSetup} className="flex flex-col gap-4 sm:gap-5">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white block">Enter PIN</label>
                <PinInputBox 
                  value={pinData.pin}
                  onChange={(e) => setPinData({...pinData, pin: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white block">Confirm PIN</label>
                <PinInputBox 
                  value={pinData.confirm}
                  onChange={(e) => setPinData({...pinData, confirm: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading || pinData.pin.length !== 4} className="h-11 px-6 rounded-xl font-bold text-[11px] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-white transition-all w-full shadow-sm">
                 Set PIN
              </Button>
            </form>
          )}
        </div>

      </motion.div>
    </div>
  );
}
