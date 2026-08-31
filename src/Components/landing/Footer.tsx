import { Link } from "react-router-dom";
import {
  PiXLogoBold,
  PiGithubLogoBold,
  PiDiscordLogoBold,
} from "react-icons/pi";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Docs", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socials = [
  { label: "X (Twitter)", icon: PiXLogoBold },
  { label: "GitHub", icon: PiGithubLogoBold },
  { label: "Discord", icon: PiDiscordLogoBold },
];

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img
                src="/lumina-logo.png"
                alt="Lumina"
                className="w-8 h-8 rounded-lg object-cover shadow-md shadow-accent/20 transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-bold tracking-tight text-txt font-display">
                Lumina
              </span>
            </Link>
            <p className="text-sm text-txt-secondary leading-relaxed max-w-xs">
              Intelligent code generation. Conversational AI. Built for
              developers who ship.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-txt mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-txt-secondary hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs text-txt-muted">
            &copy; {new Date().getFullYear()} Lumina AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-xl border border-border bg-surface-1 flex items-center justify-center text-txt-muted hover:text-txt hover:border-accent/40 transition-all"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;