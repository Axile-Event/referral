import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, Send } from "lucide-react";

/**
 * Footer Component
 * Matches the main Axile site footer (Image 3).
 * 3-column links, social icons, newsletter subscribe.
 */
export function Footer() {
  const footerLinks = {
    "Find Events": [
      { name: "Pricing", href: "#" },
      { name: "Features", href: "#" },
    ],
    "Contact Us": [
      { name: "Help Center", href: "#" },
      { name: "Careers", href: "#" },
    ],
    "Privacy Policy": [
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-[#0a0a14] border-t border-white/5 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Axile</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering event organizers and attendees with a seamless, tech-driven experience. Your Axile for the best events.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Subscribe */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Stay Updated</h4>
            <p className="text-sm text-gray-400">
              Subscribe to get event updates and news delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Email address" 
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg h-12"
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 w-12 shrink-0">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Axile • All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-600 uppercase tracking-widest">
            <span>Built with</span>
            <span className="text-primary">❤️</span>
            <span>by Team Axile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <Link 
      href="#" 
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all bg-white/5"
    >
      {icon}
    </Link>
  );
}
