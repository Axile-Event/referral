/**
 * Auth Layout
 * Wraps auth pages (login, signup) — no navbar or footer.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
