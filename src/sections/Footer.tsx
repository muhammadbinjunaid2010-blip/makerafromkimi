import { Link } from "react-router";
import { useState } from "react";
import {
  MessageCircle,
  Mail,
  MapPin,
  Github,
  Youtube,
  Linkedin,
  Globe,
  Send,
  Heart,
  Cpu,
  Wifi,
  Zap,
  Monitor,
  Layers,
  Activity,
} from "lucide-react";

const tickerItems = [
  { name: "Arduino", icon: <Cpu className="w-3 h-3" /> },
  { name: "ESP32", icon: <Wifi className="w-3 h-3" /> },
  { name: "Sensors", icon: <Activity className="w-3 h-3" /> },
  { name: "Motors", icon: <Zap className="w-3 h-3" /> },
  { name: "Displays", icon: <Monitor className="w-3 h-3" /> },
  { name: "Robotics", icon: <Layers className="w-3 h-3" /> },
  { name: "AI/ML", icon: <Cpu className="w-3 h-3" /> },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // TODO: Send newsletter subscription to backend/database
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand - 4 cols */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Makera
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Built by Makers, for Makers. A thriving community where
              electronics, robotics, embedded systems, and makers come together
              to learn, build, share, and discover.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-5">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/community"
                className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Community
              </Link>
              <Link
                to="/projects"
                className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Blog
              </Link>
              <Link
                to="/shop"
                className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Marketplace
              </Link>
            </nav>
          </div>

          {/* Company Links - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-5">
              Company
            </h4>
            <nav className="flex flex-col gap-3">
              <span className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                About
              </span>
              <span className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                Contact
              </span>
              <span className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                FAQ
              </span>
              <span className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                Terms of Service
              </span>
            </nav>
          </div>

          {/* Newsletter - 4 cols */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-5">
              Stay in the Loop
            </h4>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest projects, tutorials, and maker news delivered to
              your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <Send className="w-4 h-4" />
                Thanks for subscribing! We'll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@makera.lk"
                className="flex items-center gap-2.5 text-slate-500 text-sm hover:text-slate-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                hello@makera.lk
              </a>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-500 text-sm hover:text-slate-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                +94 77 123 4567
              </a>
              <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Colombo, Sri Lanka
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Ticker */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {tickerItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="text-blue-500">{item.icon}</span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                  {item.name}
                </span>
                {i < tickerItems.length - 1 && (
                  <span className="text-slate-600 ml-4">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs flex items-center gap-1">
            &copy; {new Date().getFullYear()} Makera. Built with{" "}
            <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by makers,
            for makers.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            {/* TODO: Add Badges, Maker Levels, Achievements, Reputation features */}
            <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer transition-colors">
              <Globe className="w-3 h-3" />
              English
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
