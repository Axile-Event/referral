"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar.jsx";
import { Navbar } from "@/components/layout/navbar.jsx";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If we've finished hydrating from provider but still not authenticated
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setIsChecking(false);
      // Fetch profile if we're auth'd but missing user data
      if (!user) {
        fetchProfile();
      }
    }
  }, [isAuthenticated, user, router, fetchProfile]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col overflow-x-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 relative w-full">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:pl-64 pt-[72px]">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
