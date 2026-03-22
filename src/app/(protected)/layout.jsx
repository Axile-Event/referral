"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar.jsx";
import { Navbar } from "@/components/layout/navbar.jsx";

export default function ProtectedLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
