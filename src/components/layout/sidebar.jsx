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
  Home
} from "lucide-react";
import { cn } from "@/lib/utils/cn.js";

/**
 * Sidebar Component
 * Matches the main Axile dashboard sidebar (Image 5).
 * Dark background, primary red active states, clean icons.
 */
export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Events", href: "/events/referral-enabled", icon: Calendar },
    { name: "My Tickets", href: "#", icon: Ticket },
    { name: "Profile", href: "#", icon: User },
  ];

  const bottomItems = [
    { name: "Settings", href: "#", icon: Settings },
    { name: "Logout", href: "/login", icon: LogOut, className: "text-red-500 hover:bg-red-500/10 hover:text-red-500" },
  ];

  return (
    <aside className="w-64 bg-[#0a0a14] border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 pt-20">
      {/* Main Nav */}
      <div className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
              <span className="font-medium">{item.name}</span>
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
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              item.className || "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
