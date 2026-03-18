"use client";

/**
 * Login Page
 *
 * Features:
 * - Email/password login form
 * - Social login (Google OAuth)
 * - Form validation with react-hook-form
 * - Toast notifications (react-hot-toast)
 * - Link to signup page
 *
 * Brand: Primary button #e11d48
 */

import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Log in to your referral account
          </p>
        </div>

        {/* TODO: Login form connected to useAuthStore */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Your password"
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
            Log In
          </button>
          <div className="relative flex items-center gap-2 my-1">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <button className="w-full h-10 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2">
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
