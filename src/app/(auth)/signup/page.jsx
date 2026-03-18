"use client";

/**
 * Sign Up Page
 *
 * Features:
 * - Email/password registration form
 * - Social login (Google OAuth)
 * - Form validation with react-hook-form
 * - Toast notifications (react-hot-toast)
 * - Link to login page
 *
 * Components Used:
 * - Button, Input, Card (shadcn/ui pattern)
 * - useForm hook (react-hook-form)
 *
 * Brand: Primary button #e11d48, Input border #e4e4e7
 */

import Link from "next/link";

export default function SignUp() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Start earning by sharing events
          </p>
        </div>

        {/* TODO: SignUp form with email, password, google auth */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
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
              placeholder="Min. 8 characters"
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
            Create Account
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
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
