import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

/**
 * Protected Layout
 * Wraps all dashboard/wallet/referral pages.
 * Integrates Sidebar and adjusts padding for fixed layout.
 */
export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <Navbar />
      <div className="flex">
        {/* Sidebar is fixed, so we need a spacer or padding-left on children */}
        <Sidebar aria-label="Main Navigation" />
        <main className="flex-1 pl-64 pt-20">
          <div className="container mx-auto p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
