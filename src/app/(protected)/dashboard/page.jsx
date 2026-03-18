import Link from "next/link";
import { Calendar, Plus, Ticket, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * Dashboard Page
 * Matches the Axile dashboard (Image 5).
 */
export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Welcome back, Ezekiel! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-gray-400 font-medium">Earn rewards by referring attendees. Your AP is credited after check-in.</p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 group">
          <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
          <Link href="/events/referral-enabled">Discover Events</Link>
        </Button>
      </div>

      {/* Grid Stats (Optional but useful) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total AP Earned" 
          value="0.00 AP" 
          icon={TrendingUp} 
          trend="Lifetime earnings"
          color="text-primary"
        />
        <StatCard 
          title="Pending AP" 
          value="0.00 AP" 
          icon={ArrowRight} 
          trend="Awaiting check-in"
          color="text-blue-500"
        />
        <StatCard 
          title="Withdrawable AP" 
          value="0.00 AP" 
          icon={Ticket} 
          trend="Min 50 AP required"
          color="text-green-500"
        />
      </div>

      {/* Upcoming Events Card */}
      <div className="bg-[#12121f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight">Your Upcoming Events</h3>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">0</span>
          </div>
          <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Empty State Section */}
        <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
            <Ticket size={40} className="stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">No upcoming events</h4>
            <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
              Ready for your next adventure? Browse available events and start earning referral rewards!
            </p>
          </div>
          <Button variant="outline" className="border-primary/20 hover:border-primary text-primary hover:bg-primary/5 rounded-xl px-8 h-12">
            <Link href="/events/referral-enabled">Explore Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
  return (
    <div className="bg-[#12121f] border border-white/5 p-6 rounded-3xl space-y-4 hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors", color)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-extrabold text-white tracking-tight">{value}</h4>
      </div>
      <p className="text-xs text-gray-400 font-medium">{trend}</p>
    </div>
  );
}
