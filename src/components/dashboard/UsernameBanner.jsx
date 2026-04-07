"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UsernameBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 shadow-xl"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <UserPlus size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">Claim your username</h3>
            <p className="text-white/80 text-sm max-w-md">
              Complete your profile by setting a unique username. This is how you'll be identified across Axile.
            </p>
          </div>
        </div>

        <Button asChild className="bg-white text-blue-600 hover:bg-white/90 rounded-xl px-8 h-12 font-bold shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto">
          <Link href="/dashboard/settings">
            Set Username <ArrowRight className="ml-2" size={18} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
