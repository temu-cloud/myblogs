"use client";
import Link from "next/link";
import Logo from "./Logo";
import { LuMenu, LuNotebookPen, LuSearch, LuX } from "react-icons/lu";
import MobileNav from "./MobileNav";
import { useState } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { authClient } from "@/app/lib/auth-client";

export const navlinks = [
  { url: "/", label: "Home" },
  { url: "/articles", label: "Projects" },
  { url: "/about", label: "About me" },
];

export default function Navbar() {
  const { openSignIn, openSearch } = useModalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const isAdmin = session?.user && (session.user as { role?: string }).role === "admin";

  return (
    <nav className="h-16 fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center justify-between h-full w-[92%] max-w-7xl mx-auto">
        <Logo />

        <ul className="flex items-center gap-2 md:gap-6 text-gray-300 font-medium text-sm">
          {/* Desktop nav links */}
          {navlinks.map((link) => (
            <li key={link.url} className="hidden md:block">
              <Link href={link.url} className="hover:text-white transition-colors px-1 py-1">
                {link.label}
              </Link>
            </li>
          ))}

          {/* Search */}
          <li>
            <button
              onClick={openSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm"
            >
              <LuSearch size={15} />
              <span className="hidden sm:block">Search</span>
            </button>
          </li>

          {/* Write (admin only) */}
          {isAdmin && (
            <li>
              <Link
                href="/write"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm"
              >
                <LuNotebookPen size={15} /> Post
              </Link>
            </li>
          )}

          {/* Auth button */}
          {!isPending && (
            session ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={openSignIn}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-sm font-medium shadow-lg shadow-indigo-900/30"
                >
                  Sign in
                </button>
              </li>
            )
          )}

          {/* Mobile hamburger */}
          <li className="cursor-pointer md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </li>
        </ul>
      </div>
      <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </nav>
  );
}
