import { redirect } from "next/navigation";

/**
 * Landing Page - Redirect to Login
 * (As per user request, there is no landing page for the referral sub-site)
 */
export default function LandingPage() {
  redirect("/login");
  return null;
}
