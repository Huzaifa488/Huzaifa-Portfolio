'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Github, Linkedin, Download,
  Sparkles, Code2, Zap, BrainCircuit, Smartphone,
} from 'lucide-react'
import type { Profile } from '@/types/database'

/* ── Roles cycled in the typewriter ─────────────────── */
const ROLES = [
  'Software Developer',
  'Android Developer',
  'ML Engineer',
  'Full-Stack Builder',
]

/* ── Floating tech badges around profile pic ─────────── */
const BADGES = [
  { icon: Code2,       label: 'Dev',     pos: 'top-0 -right-6',    delay: '0s',    color: 'text-primary-500' },
  { icon: BrainCircuit,label: 'AI / ML', pos: '-bottom-4 -left-8', delay: '1.2s',  color: 'text-violet-500' },
  { icon: Smartphone,  label: 'Android', pos: 'top-1/2 -left-10',  delay: '2.4s',  color: 'text-emerald-500' },
  { icon: Zap,         label: 'Fast',    pos: '-top-4 left-1/4',   delay: '0.8s',  color: 'text-amber-500' },
]

interface HeroSectionProps {
  profile: Profile | null
}

export function HeroSection({ profile }: HeroSectionProps) {
  /* ── Typewriter state ─────────────────────────────── */
  const [roleIdx,      setRoleIdx]      = useState(0)
  const [displayText,  setDisplayText]  = useState('')
  const [isDeleting,   setIsDeleting]   = useState(false)

  useEffect(() => {
    const role = ROLES[roleIdx]
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText.length < role.length) {
      timer = setTimeout(() => setDisplayText(role.slice(0, displayText.length + 1)), 75)
    } else if (!isDeleting && displayText.length === role.length) {
      timer = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayText.length > 0) {
      timer = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 38)
    } else {
      setIsDeleting(false)
      setRoleIdx((i) => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, roleIdx])

  /* ── Derived initials for avatar fallback ─────────── */
  const name     = profile?.name ?? 'Huzaifa Nadeem'
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('')

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden
                 bg-white dark:bg-gray-950"
    >
      {/* ── Animated background layer ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-0 w-[650px] h-[650px]
                        bg-primary-50 dark:bg-primary-900/10 rounded-full
                        translate-x-1/3 -translate-y-1/4 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px]
                        bg-violet-50 dark:bg-violet-900/10 rounded-full
                        -translate-x-1/4 translate-y-1/4 blur-3xl animate-pulse-slow"
             style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/2 w-[350px] h-[350px]
                        bg-pink-50 dark:bg-pink-900/5 rounded-full
                        -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"
             style={{ animationDelay: '3s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid text-gray-900/[0.018] dark:text-white/[0.025]" />
      </div>

      <div className="section-container relative z-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Text content ─────────────────────── */}
          <div className="order-2 lg:order-1 animate-slide-up">

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-primary-50 dark:bg-primary-900/30
                            border border-primary-100 dark:border-primary-800 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                                 bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300
                               uppercase tracking-wider">
                Open to opportunities
              </span>
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight
                           text-gray-900 dark:text-white leading-[1.05] mb-4
                           whitespace-nowrap">
              {name}
            </h1>

            {/* Typewriter role */}
            <div className="flex items-center gap-1 h-10 mb-6">
              <span className="text-xl sm:text-2xl font-semibold
                               text-primary-600 dark:text-primary-400">
                {displayText}
              </span>
              <span className="inline-block w-0.5 h-6 bg-primary-500 dark:bg-primary-400
                               animate-blink ml-0.5" />
            </div>

            {/* Bio */}
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed
                          max-w-xl mb-10">
              {profile?.bio ??
                'Final-year Computer Science student with hands-on experience building Android applications, machine learning pipelines, and full-stack web systems. Passionate about solving real-world problems through clean, scalable software.'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#projects" className="btn-primary text-base px-8 py-3.5 group">
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="btn-secondary text-base px-8 py-3.5">
                Get In Touch
              </a>
              {profile?.resume_url && (
                <Link
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-base px-6 py-3.5"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </Link>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6">
              {profile?.github && (
                <Link
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium
                             text-gray-500 dark:text-gray-400
                             hover:text-gray-900 dark:hover:text-white
                             transition-colors group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  GitHub
                </Link>
              )}
              {profile?.linkedin && (
                <Link
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium
                             text-gray-500 dark:text-gray-400
                             hover:text-primary-600 dark:hover:text-primary-400
                             transition-colors group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  LinkedIn
                </Link>
              )}
            </div>
          </div>

          {/* ── RIGHT: Animated profile picture ───────── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end
                          animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">

              {/* Outermost slow-spinning dashed ring */}
              <div className="absolute -inset-8 rounded-full border border-dashed
                              border-primary-200/50 dark:border-primary-700/30
                              animate-spin-very-slow" />

              {/* Middle reverse-spin dashed ring */}
              <div className="absolute -inset-4 rounded-full border border-dashed
                              border-violet-300/40 dark:border-violet-600/25
                              animate-spin-reverse" />

              {/* Spinning gradient ring (conic) */}
              <div className="absolute inset-0 rounded-full p-[3px] animate-spin-slow">
                <div className="absolute inset-0 rounded-full profile-ring-gradient" />
              </div>

              {/* Glow halo */}
              <div className="absolute inset-0 rounded-full
                              bg-primary-400/25 dark:bg-primary-500/20
                              blur-2xl animate-glow-pulse" />

              {/* ── Photo / Avatar ─────────────────────── */}
              <div className="relative w-full h-full rounded-full overflow-hidden
                              border-4 border-white dark:border-gray-900
                              shadow-2xl z-10">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 288px, 320px"
                  />
                ) : (
                  /* Animated gradient fallback with initials */
                  <div
                    className="w-full h-full flex items-center justify-center
                               animate-gradient-x"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed, #ec4899, #2563eb)',
                      backgroundSize: '300% 300%',
                      animation: 'gradientX 6s ease infinite',
                    }}
                  >
                    <span className="text-6xl sm:text-7xl font-extrabold text-white
                                     tracking-tight select-none drop-shadow-lg">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Floating tech badges ───────────────── */}
              {BADGES.map(({ icon: Icon, label, pos, delay, color }) => (
                <div
                  key={label}
                  className={`absolute ${pos} z-20 bg-white dark:bg-gray-800
                              rounded-xl shadow-lg px-2.5 py-1.5
                              flex items-center gap-1.5 animate-float`}
                  style={{ animationDelay: delay }}
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200
                                   whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scroll indicator ───────────────────────────── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-2
                        text-gray-400 dark:text-gray-600 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent
                          to-gray-300 dark:to-gray-700" />
        </div>
      </div>
    </section>
  )
}
