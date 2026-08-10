"use client";

import { useState } from "react";
import { Github, Linkedin, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#fbfbfd]/80 border-b border-zinc-200/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo mark */}
        <a
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d1d1f] text-white text-sm font-semibold tracking-tight transition-transform duration-200 hover:scale-105"
        >
          T
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-zinc-200" />

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={18} strokeWidth={1.75} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200/50 bg-[#fbfbfd]/95 backdrop-blur-md px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-4 border-t border-zinc-200/50 pt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={18} strokeWidth={1.75} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
