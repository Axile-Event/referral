"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * Navbar Component
 * Matches the main Axile site header.
 * Dark background, glass effect, primary red CTA.
 */
export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/login") || pathname.includes("/signup");

  if (isAuthPage) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Events", href: "/events/referral-enabled" },
    { name: "Features", href: "#features" },
    { name: "Hiring", href: "#hiring" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/axile-logo-main.png" 
            alt="Axile" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

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
