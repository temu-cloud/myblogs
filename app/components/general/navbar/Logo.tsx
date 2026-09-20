import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 font-bold text-lg">
      <span className="text-white">Temu</span>
      <span className="text-indigo-400">folio</span>
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mb-0.5 animate-pulse" />
    </Link>
  );
}
