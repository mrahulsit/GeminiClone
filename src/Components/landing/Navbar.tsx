import { Link } from "react-router-dom";
import { PiArrowRightBold } from "react-icons/pi";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 bg-gray-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/lumina-logo.png"
            alt="Lumina"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <span className="text-xl font-bold text-gray-100 font-display">Lumina</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/app"
            className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            Chat
          </a>
          <a
            href="/pricing"
            className="text-gray-400 hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          {window.innerWidth < 768 ? (
            <button
              onClick={() => {}}
              className="p-2 rounded-xl hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          ) : null}
          <button
            onClick={() => {}}
            className="hidden sm:block px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;