import { Link } from "react-router";
import {
  MessageCircle,
  Mail,
  Clock,
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
  { name: "IoT", icon: <Wifi className="w-3 h-3" /> },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4">ElectroCart</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your trusted source for Arduino, electronics, and IoT components
              in Sri Lanka.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@electrocart.lk"
                className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/shop"
                className="text-slate-400 text-sm hover:text-white transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/shop"
                className="text-slate-400 text-sm hover:text-white transition-colors"
              >
                Categories
              </Link>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">
                About Us
              </span>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">
                Contact
              </span>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">
                FAQ
              </span>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-400 text-sm hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                +94 77 123 4567
              </a>
              <a
                href="mailto:hello@electrocart.lk"
                className="flex items-center gap-2.5 text-slate-400 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                hello@electrocart.lk
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Clock className="w-4 h-4 text-amber-500" />
                Mon–Sat, 9AM–6PM
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
          <p className="text-center text-slate-500 text-xs mt-4">
            Currently helping students build their next project.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            &copy; 2025 ElectroCart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span>&middot;</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
