import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mx-auto max-w-6xl border-t border-zinc-200/60 px-6 py-8 mt-24"
    >
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Copyright */}
        <p className="text-xs text-[#86868b]">
          &copy; {new Date().getFullYear()} Toufik. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} strokeWidth={1.75} />
          </a>
          <a
            href="mailto:hello@example.com"
            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={16} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
