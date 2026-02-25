import Link from 'next/link'
import { ArrowRight, Github, Linkedin, Download, Sparkles } from 'lucide-react'
import type { Profile } from '@/types/database'

interface HeroSectionProps {
  profile: Profile | null
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden
                 bg-white dark:bg-gray-950"
    >
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px]
                        bg-primary-50 dark:bg-primary-900/10 rounded-full
                        translate-x-1/3 -translate-y-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]
                        bg-blue-50 dark:bg-blue-900/10 rounded-full
                        -translate-x-1/4 translate-y-1/4 blur-3xl" />
      </div>

      <div className="section-container relative z-10 py-32">
        <div className="max-w-3xl animate-slide-up">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-primary-50 dark:bg-primary-900/30 border border-primary-100
                          dark:border-primary-800 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
              Open to opportunities
            </span>
          </div>

          {/* Name */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight
                         text-gray-900 dark:text-white leading-none mb-4">
            {profile?.name ?? 'Huzaifa Nadeem'}
          </h1>

          {/* Title */}
          <p className="text-xl sm:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-6">
            {profile?.title ?? 'Software Developer | AI & Mobile Systems'}
          </p>

          {/* Bio */}
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-10">
            {profile?.bio ??
              'Final-year Computer Science student with hands-on experience building Android applications, machine learning pipelines, and full-stack web systems. Passionate about solving real-world problems through clean, scalable software.'}
          </p>

          {/* CTA Buttons */}
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
          <div className="flex items-center gap-5">
            {profile?.github && (
              <Link
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400
                           hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                GitHub
              </Link>
            )}
            {profile?.linkedin && (
              <Link
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400
                           hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                LinkedIn
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                        text-gray-400 dark:text-gray-600 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-gray-300 dark:to-gray-700" />
        </div>
      </div>
    </section>
  )
}
