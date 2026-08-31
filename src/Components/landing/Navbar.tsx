import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiArrowRightBold, PiListBold, PiXBold } from "react-icons/pi";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-0/85 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/lumina-logo.png"
            alt="Lumina"
            className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-accent/25 transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold text-txt font-display tracking-tight">
            Lumina
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-3.5 py-2 text-sm font-medium text-txt-muted hover:text-txt transition-colors after:absolute after:left-3.5 after:right-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/app"
            className="px-4 py-2 rounded-xl text-sm font-medium text-txt-secondary hover:text-txt hover:bg-surface-2 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/app"
            className="gradient-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold active:scale-95"
          >
            Get started
            <PiArrowRightBold className="w-4 h-4" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-surface-2 text-txt-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <PiXBold className="w-5 h-5" /> : <PiListBold className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface-0/95 backdrop-blur-xl animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-border my-2" />
            <Link
              to="/app"
              className="gradient-btn flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold active:scale-[0.98]"
            >
              Get started
              <PiArrowRightBold className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;