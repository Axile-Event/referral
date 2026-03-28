import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ReferralProvider } from "@/components/referral/referral-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata = {
  title: "Axile Referral System",
  description: "Earn money by referring events to your network",
  icons: {
    icon: "/axile-logo-main-cropped.png",
    apple: "/axile-logo-main-cropped.png",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="bg-background text-foreground antialiased text-sm">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <ReferralProvider>
              {children}
            </ReferralProvider>
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgb(18, 18, 31)",
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
