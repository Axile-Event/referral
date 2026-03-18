import Link from "next/link";

/**
 * Landing/Home Page
 *
 * Displays:
 * - Hero section with referral value proposition
 * - How referrals work (3-step process)
 * - Feature highlights
 * - CTA buttons (Sign Up, Login)
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary tracking-tight">
          Axile <span className="text-foreground">Referral</span>
        </span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          Axile Event Platform
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
          Earn by Sharing{" "}
          <span className="text-primary">Events You Love</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Generate referral links for any event on Axile. Every time someone
          buys a ticket through your link, you earn a commission — instantly.
        </p>
        <div className="flex gap-4 mt-2">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Earning
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Browse Events",
              desc: "Explore events on Axile with referral rewards enabled.",
            },
            {
              step: "02",
              title: "Generate Your Link",
              desc: "Get a unique referral link or QR code for any event.",
            },
            {
              step: "03",
              title: "Earn Commissions",
              desc: "Earn money every time someone registers via your link.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card"
            >
              <span className="text-4xl font-black text-primary/20">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Axile Event Platform. All rights reserved.
      </footer>
    </main>
  );
}
