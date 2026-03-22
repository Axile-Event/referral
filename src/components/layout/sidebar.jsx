"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Calendar, 
  Ticket, 
  Settings, 
  LogOut,
  Home,
  X
} from "lucide-react";
import { cn } from "@/lib/utils/cn.js";
import { Button } from "@/components/ui/button.jsx";

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
          "fixed inset-0 bg-black/60 z-[60] lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside className={cn(
        "w-64 bg-[#0a0a14] border-r border-white/10 flex flex-col h-screen fixed top-0 left-0 z-[70] transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="h-[72px] px-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a14] z-10">
          <Link href="/" onClick={onClose} className="flex">
            <img 
              src="/axile-logo-main-cropped.png" 
              alt="Axile" 
              className="h-8 w-auto object-contain"
            />
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 py-6 space-y-1 border-t border-white/10">
          {bottomItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                item.className || "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
