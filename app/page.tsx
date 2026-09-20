import { LuArrowRight, LuCode, LuGlobe, LuServer } from "react-icons/lu";
import ContainerLayout from "./layouts/ContainerLayout";
import Image from "next/image";
import Link from "next/link";
import RecentPosts from "./components/home/RecentPosts";
import { Suspense } from "react";
import PostCardSkeleton from "./components/skeletons/PostCardSkeleton";

const skills = [
  { icon: <LuCode size={22} />, label: "Frontend", desc: "React · Next.js · TypeScript · Tailwind" },
  { icon: <LuServer size={22} />, label: "Backend", desc: "Node.js · Express · Django · REST APIs" },
  { icon: <LuGlobe size={22} />, label: "Database & Tools", desc: "PostgreSQL · MongoDB · Prisma · Cloudinary" },
];

export default function Home() {
  return (
    <ContainerLayout>
      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center py-24">
        {/* ambient glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-3xl" />
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Available for opportunities
        </span>

        <h1 className="gradient-text text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl">
          Hi, I&apos;m Temesgen Molla
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-indigo-300 font-medium">
          Full-Stack Developer · Computer Engineer
        </p>
        <p className="mt-6 text-gray-400 max-w-2xl leading-relaxed text-base sm:text-lg">
          I build practical, scalable web applications that solve real-world problems.
          Passionate about clean code, great UX, and modern technologies.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-900/40"
          >
            About me <LuArrowRight size={16} />
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200"
          >
            View Projects
          </Link>
        </div>
      </section>

      {/* ── Profile + Bio ── */}
      <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/10 blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
          <Image
            src="/hero.png"
            alt="Temesgen Molla"
            width={600}
            height={600}
            className="relative rounded-2xl border border-white/10 w-full object-cover"
          />
        </div>

        <div>
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Who am I
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-snug mb-6">
            Building solutions that create real value
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            I&apos;m a Computer Engineering graduate from the University of Gondar and a passionate software developer. I focus on building modern web applications using React, Next.js, Node.js, Django, and various databases. I&apos;m continuously improving my skills while building solutions that make a difference.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {skills.map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-secondary-background border border-white/5 card-glow">
                <div className="text-indigo-400 mb-2">{s.icon}</div>
                <p className="text-white font-semibold text-sm mb-1">{s.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            More about me <LuArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Recent Posts ── */}
      <section className="py-10 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-1">Latest writing</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Posts</h2>
          </div>
          <Link href="/articles" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            All posts <LuArrowRight size={14} />
          </Link>
        </div>
        <Suspense fallback={<PostCardSkeleton />}>
          <RecentPosts />
        </Suspense>
      </section>
    </ContainerLayout>
  );
}
