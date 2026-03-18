"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Calendar, 
  Ticket, 
  User, 
  Settings, 
  LogOut,
  Home,
  X
} from "lucide-react";
import { cn } from "@/lib/utils/cn.js";
import { Button } from "@/components/ui/button.jsx";

/**
 * Sidebar Component
 * Matches the main Axile dashboard sidebar (Image 5).
 * Responsive: Drawer on mobile, fixed on desktop.
 */
export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Referral Events", href: "/events/referral-enabled", icon: Calendar },
    { name: "My Referrals", href: "/dashboard/referrals", icon: Ticket },
    { name: "Wallet", href: "/dashboard/wallet", icon: BarChart3 },
  ];

  const bottomItems = [
    { name: "Settings", href: "#", icon: Settings },
    { name: "Logout", href: "/login", icon: LogOut, className: "text-red-500 hover:bg-red-500/10 hover:text-red-500" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside className={cn(
        "w-72 bg-[#0a0a14] border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 z-[70] transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <img 
              src="/axile-logo-main-cropped.png" 
              alt="Axile" 
              className="h-9 w-auto object-contain"
            />
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </div>

        {/* Main Nav */}
        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Nav */}
        <div className="px-4 py-8 space-y-2 border-t border-white/5">
          {bottomItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                item.className || "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
