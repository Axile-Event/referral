"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation Bar Component
 *
 * Features:
 * - Logo/brand
 * - Navigation links (Dashboard, Referrals, Wallet, Events)
 * - User menu dropdown (TODO)
 * - Dark mode toggle (TODO)
 *
 * Colors:
 * - Background: #ffffff (light) / #12121f (dark)
 * - Border: #e4e4e7 (light) / #27272a (dark)
 */

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/referrals", label: "Referrals" },
  { href: "/dashboard/wallet", label: "Wallet" },
  { href: "/events/referral-enabled", label: "Events" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link href="/dashboard" className="text-lg font-bold text-primary tracking-tight">
        Axile <span className="text-foreground">Referral</span>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* TODO: User avatar dropdown via useAuthStore */}
        <button className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
          U
        </button>
      </div>
    </nav>
  );
}
