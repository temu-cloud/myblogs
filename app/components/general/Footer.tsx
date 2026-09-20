"use client";

import Link from "next/link";
import { FaTelegram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24 bg-secondary-background/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <p className="text-white font-bold text-lg mb-1">
              Temu<span className="text-indigo-400">folio</span>
            </p>
            <p className="text-gray-500 text-sm">Full-Stack Developer · Computer Engineer</p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/articles" className="hover:text-white transition-colors">Projects</Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { href: "https://t.me/temesgenML", icon: <FaTelegram size={16} />, label: "Telegram" },
              { href: "https://www.linkedin.com/in/temesgen-molla-4265513a1", icon: <FaLinkedin size={16} />, label: "LinkedIn" },
              { href: "https://github.com", icon: <FaGithub size={16} />, label: "GitHub" },
            ].map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Temufolio · Built with Next.js
        </div>
      </div>
    </footer>
  );
}
