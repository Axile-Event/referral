"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

/**
 * GoogleSignupButton Component
 * Handles Google OAuth authentication using @react-oauth/google
 * 
 * Flow:
 * 1. User clicks Google button
 * 2. Google OAuth popup opens
 * 3. User authenticates with Google
 * 4. Returns ID token to backend
 * 5. Backend validates token and returns JWT tokens
 * 6. User is logged in or needs to complete registration
 */
export function GoogleSignupButton({ variant = "signup" }) {
  const router = useRouter();
  const { googleSignup, isLoading } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    
    try {
      const response = await googleSignup(token);
      
      // If successful, tokens are stored and user is authenticated
      if (response) {
        toast.success("Great! Logged in with Google.");
        
        // Check if user has complete profile
        if (response.user && response.access) {
          // User is fully authenticated
          router.push("/dashboard");
        } else if (response.email) {
          // User exists but might need profile completion
          router.push("/dashboard");
        } else {
          // Edge case: token accepted but no user data
          router.push("/login");
        }
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 
                      error?.response?.data?.error ||
                      "Google authentication failed. Please try again.";
      toast.error(errorMsg);
      console.error("Google signup error:", error?.response?.data);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="dark"
        text="continue_with"
      />
    </div>
  );
}

export default GoogleSignupButton;
