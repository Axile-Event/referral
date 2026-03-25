import toast from "react-hot-toast";
import { create } from "zustand";
import { referralApi } from "@/lib/api/referral";

/**
 * Referral Store (Zustand)
 *
 * State: referrals[], myReferralCode, totalEarnings, isLoading
 * Actions: fetchUserReferrals, generateReferralLink, trackReferralClick
 */
export const useReferralStore = create((set, get) => ({
  referrableEvents: [
    {
      event_id: "event:AB-12345",
      name: "Axile Tech Summit 2025",
      reward: "15% Commission",
      image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800&auto=format&fit=crop&q=60",
      category: "Tech"
    },
    {
      event_id: "event:BC-23456",
      name: "Lagos Night Carnival",
      reward: "Fixed ₦1,000",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60",
      category: "Music"
    }
  ],
  referrals: [
    { 
      id: "1", 
      name: "Axile Tech Summit 2025", 
      reward: "15% Commission", 
      clicks: 1240, 
      conversions: 84, 
      earned: "₦126,000", 
      status: "Active",
      image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800&auto=format&fit=crop&q=60"
    },
    { 
      id: "2", 
      name: "Lagos Night Carnival", 
      reward: "Fixed ₦1,000", 
      clicks: 852, 
      conversions: 42, 
      earned: "₦42,000", 
      status: "Active",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60"
    }
  ],
  myReferralCode: "AXILE-SUMMIT-2025-EZK",
  totalEarnings: 168000,
  isLoading: false,

  fetchUserReferrals: async () => {
    // For now we use the mock data already in state
    set({ isLoading: true });
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    set({ isLoading: false });
  },

  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      set({ referrableEvents: data });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error("failed to fetch events that are up for referrals")
    } finally {
      set({ isLoading: false });
    }
  },

  generateReferralLink: async (eventId) => {
    // TODO: const link = await referralApi.generateLink(eventId);
    // return link;
    return "";
  },

  trackReferralClick: async (code, eventId) => {
    // TODO: await referralApi.trackClick(code, eventId);
  },
}));
