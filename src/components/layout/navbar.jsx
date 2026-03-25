"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button.jsx";
import { Menu, User, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Navbar({ onMenuClick }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const isAuthPage = pathname.includes("/login") || pathname.includes("/signup");
  const isProtected = pathname.includes("/dashboard") || pathname.includes("/events");

  if (isAuthPage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14] border-b border-white/10 h-[72px]">
      <div className="flex flex-1 h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Toggle & Logo wrapper */}
        <div className="flex items-center gap-4">
          {isProtected && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={onMenuClick}
            >
              <Menu size={20} />
            </Button>
          )}

          <Link href="/" className="flex items-center lg:hidden">
            <img 
              src="/axile-logo-main-cropped.png" 
              alt="Axile" 
              className="h-8 w-auto object-contain"
            />
          </Link>
          
          {/* Spacing for desktop where sidebar covers left side */}
          <div className="hidden lg:block w-64 border-r border-white/10 -ml-8 h-[72px] lg:flex items-center px-6 invisible">
             {/* Invisible placeholder simply to align navbar items to the right of the sidebar visually if we wanted inside navbar, but here navbar spans full width so we just let it flow. Wait, if sidebar has high z-index and spans full height, the navbar goes underneath. Let's make navbar flex and adjust padding. */}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/settings" className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/20 hover:bg-primary/30 transition-colors">
                  <User size={18} />
                </Link>
              </div>
          ) : (
             <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
                  Login
                </Link>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-md px-6">
                  <Link href="/signup">Get Started</Link>
                </Button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}
