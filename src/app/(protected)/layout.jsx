"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar.jsx";
import { Navbar } from "@/components/layout/navbar.jsx";

/**
 * Protected Layout
 * Wraps all dashboard/wallet/referral pages.
 * Responsive: Toggleable sidebar on mobile, fixed on lg.
 */
export default function ProtectedLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 lg:pl-72 pt-16 lg:pt-0">
          <div className="container mx-auto p-4 sm:p-8 animate-fade-in max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
