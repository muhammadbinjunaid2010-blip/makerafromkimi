import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, ShoppingCart, Menu, X, MessageCircle } from "lucide-react";
import { useCartContext } from "../App";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCartContext();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHome) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Community", href: "/community", scrollId: null },
    { label: "Projects", href: "/projects", scrollId: null },
    { label: "Blog", href: "/blog", scrollId: null },
    { label: "Marketplace", href: "/shop", scrollId: null },
    { label: "About", href: null, scrollId: "why-choose" },
    { label: "Contact", href: null, scrollId: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl font-extrabold tracking-tight transition-colors ${
            scrolled || !isHome ? "text-slate-800" : "text-white"
          }`}
        >
          Makera
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href ? (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled || !isHome ? "text-slate-600" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.scrollId!)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled || !isHome ? "text-slate-600" : "text-white/90"
                }`}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            className={`p-2 rounded-lg transition-colors ${
              scrolled || !isHome
                ? "text-slate-600 hover:bg-slate-100"
                : "text-white/90 hover:bg-white/10"
            }`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/cart"
            className={`relative p-2 rounded-lg transition-colors ${
              scrolled || !isHome
                ? "text-slate-600 hover:bg-slate-100"
                : "text-white/90 hover:bg-white/10"
            }`}
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHome
                ? "text-slate-600 hover:bg-slate-100"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    if (isHome) {
                      scrollToSection(link.scrollId!);
                    } else {
                      window.location.href = "/";
                    }
                  }}
                  className="text-left text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-50"
                >
                  {link.label}
                </button>
              )
            )}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-medium py-2.5 px-4 rounded-lg mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
