"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils/cn.js";
import { Menu } from "lucide-react";

/**
 * Navbar Component
 * Matches the main Axile site header.
 * Added mobile menu toggle for protected pages.
 */
export function Navbar({ onMenuClick }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/login") || pathname.includes("/signup");
  const isProtected = pathname.includes("/dashboard") || pathname.includes("/events");

  if (isAuthPage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle (Only for protected pages) */}
          {isProtected && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </Button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/axile-logo-main.png" 
              alt="Axile" 
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white border-none rounded-md px-6">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
