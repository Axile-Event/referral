import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without conflicts.
 * Uses clsx for conditional logic + tailwind-merge to deduplicate.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
