"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sidebar Component
 *
 * Features:
 * - Menu items with icons (lucide-react)
 * - Active state highlight
 * - Collapsible on mobile (TODO)
 */

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/referrals", label: "Referrals" },
  { href: "/dashboard/wallet", label: "Wallet" },
  { href: "/events/referral-enabled", label: "Events" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col gap-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
