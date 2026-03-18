import { Navbar } from "@/components/layout/navbar";

/**
 * Protected Layout
 * Wraps all authenticated routes. Renders Navbar.
 * TODO: Add auth guard redirect if not logged in.
 */
export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
