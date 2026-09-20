import { navlinks } from './Navbar'
import Link from 'next/link'

interface MobileNavProps {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
}

export default function MobileNav({ setMenuOpen, menuOpen }: MobileNavProps) {
  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Slide-in drawer */}
      <ul className={`fixed top-16 right-0 z-50 w-64 h-full flex flex-col gap-1 px-4 pt-6 bg-background border-l border-white/5 transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {navlinks.map((link) => (
          <li key={link.url}>
            <Link
              onClick={() => setMenuOpen(false)}
              href={link.url}
              className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
