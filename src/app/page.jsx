import { redirect } from "next/navigation";

/**
 * Root route redirects to login as requested.
 */
export default function IndexPage() {
  redirect("/login");
}
