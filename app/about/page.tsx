import ContainerLayout from '../layouts/ContainerLayout'
import Link from 'next/link'
import Image from 'next/image'
import { LuArrowUpRight, LuCode, LuGlobe, LuServer, LuDatabase } from 'react-icons/lu'
import { FaTelegram, FaLinkedin, FaGithub } from 'react-icons/fa'

const skills = [
  { icon: <LuCode size={18} />, cat: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript"] },
  { icon: <LuServer size={18} />, cat: "Backend", items: ["Node.js", "Express.js", "Django", "REST APIs", "Socket.IO"] },
  { icon: <LuDatabase size={18} />, cat: "Database", items: ["PostgreSQL", "MongoDB", "Prisma ORM"] },
  { icon: <LuGlobe size={18} />, cat: "Tools", items: ["Git", "GitHub", "Cloudinary", "Vercel", "Docker basics"] },
]

const socials = [
  { href: "https://t.me/temesgenML", icon: <FaTelegram size={18} />, label: "Telegram", color: "hover:border-sky-400/50 hover:text-sky-400" },
  { href: "https://www.linkedin.com/in/temesgen-molla-4265513a1", icon: <FaLinkedin size={18} />, label: "LinkedIn", color: "hover:border-blue-400/50 hover:text-blue-400" },
  { href: "https://github.com", icon: <FaGithub size={18} />, label: "GitHub", color: "hover:border-purple-400/50 hover:text-purple-400" },
]

export default function AboutPage() {
  return (
    <ContainerLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 pb-24">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">About me</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Temesgen Molla
          </h1>
          <p className="text-indigo-300 font-medium mb-6">Full-Stack Developer · Computer Engineer</p>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I&apos;m a Computer Engineer and Full-Stack Developer passionate about transforming ideas and real-world challenges into reliable digital products. I have experience building web applications, management systems, booking platforms, and real-time applications using modern development technologies.
          </p>
        </div>

        {/* ── Profile image + bio ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/10 blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
            <Image
              src="/me.jpg"
              alt="Temesgen Molla"
              height={500}
              width={500}
              className="relative rounded-2xl border border-white/10 w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">My journey</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              I graduated from the University of Gondar with a degree in Computer Engineering. Since then I&apos;ve been building web applications that solve real problems — from management systems and booking platforms to real-time apps and portfolio sites.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              I enjoy learning new technologies, solving complex problems, and continuously improving my ability to build clean, efficient, and user-focused software.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Problem Solver", "Team Player", "Continuous Learner", "Open to Work"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Skills ── */}
        <div className="mb-20">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Expertise</p>
          <h2 className="text-2xl font-bold text-white mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((s) => (
              <div key={s.cat} className="p-5 rounded-xl bg-secondary-background border border-white/5 card-glow">
                <div className="flex items-center gap-2 text-indigo-400 mb-3">
                  {s.icon}
                  <span className="font-semibold text-sm text-white">{s.cat}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map(item => (
                    <span key={item} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-gray-300 border border-white/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="rounded-2xl bg-secondary-background border border-white/5 p-8 text-center card-glow">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Get in touch</p>
          <h2 className="text-2xl font-bold text-white mb-3">Let&apos;s work together</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            I&apos;m open to freelance work, full-time roles, and interesting collaborations. Feel free to reach out.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-medium text-sm transition-all duration-200 ${s.color}`}
              >
                {s.icon} {s.label} <LuArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </ContainerLayout>
  )
}
