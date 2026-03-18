import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Custom 404 Page for Axile Referral System.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col items-center justify-center p-6 text-center space-y-8">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
      
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-700" />
        <div className="relative z-10 w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-2xl shadow-primary/10">
          <HelpCircle size={48} className="stroke-[1.5]" />
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <h1 className="text-6xl font-black tracking-tighter text-white">404</h1>
        <h2 className="text-2xl font-bold text-gray-200 tracking-tight">Oops! Page not found.</h2>
        <p className="text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="pt-4 relative z-10">
        <Link href="/">
          <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg group">
            <MoveLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Safety
          </Button>
        </Link>
      </div>

      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] pt-12">
        Axile Referral System
      </p>
    </div>
  );
}
