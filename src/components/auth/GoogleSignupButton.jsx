"use client";

import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button.jsx";
import { Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * GoogleSignupButton Component
 * Custom styled Google OAuth button that matches the design system
 * 
 * Flow:
 * 1. User clicks button
 * 2. Google OAuth popup opens
 * 3. User authenticates with Google
 * 4. Returns ID token to backend
 * 5. Backend validates token and returns JWT tokens
 * 6. User is logged in
 */
export function GoogleSignupButton({ variant = "signup" }) {
  const router = useRouter();
  const { googleSignup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        const result = await googleSignup(response.access_token);
        
        if (result?.access) {
          toast.success("Great! Logged in with Google.");
          router.push("/dashboard");
        }
      } catch (error) {
        const errorMsg = error?.response?.data?.message || 
                        error?.response?.data?.error ||
                        "Google authentication failed. Please try again.";
        toast.error(errorMsg);
        console.error("Google signup error:", error?.response?.data);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
      setIsLoading(false);
    },
    flow: "implicit",
  });

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="lg" 
      className="w-full h-14 rounded-2xl font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white group transition-all"
      onClick={() => login()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <img 
            src="/Logo-google-icon-PNG.png" 
            alt="Google" 
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
          />
          {variant === "login" ? "Continue with Google" : "Sign up with Google"}
        </>
      )}
    </Button>
  );
}

export default GoogleSignupButton;
