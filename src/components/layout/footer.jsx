/**
 * Footer Component
 *
 * Features:
 * - Links (Terms, Privacy, Contact)
 * - Copyright
 * - Social links
 */
export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Axile Event Platform</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
