/**
 * Auth Layout
 * Wraps auth pages (login, signup) — no navbar or footer.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {children}
    </div>
  );
}
