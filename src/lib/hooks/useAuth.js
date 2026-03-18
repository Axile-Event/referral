import { useAuthStore } from "@/store/authStore";

/**
 * useAuth hook
 * Convenience wrapper around useAuthStore with derived helpers.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, signup, logout, setUser } =
    useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    setUser,
  };
}
