import { Github, Linkedin, Mail, Code2, Settings } from 'lucide-react'
import Link from 'next/link'
import type { Profile } from '@/types/database'

interface FooterProps {
  profile: Profile | null
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="section-container py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Code2 className="w-4 h-4 text-primary-600" />
            <span>{profile?.name ?? 'Huzaifa Nadeem'}</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {profile?.github && (
              <Link
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-5 h-5" />
              </Link>
            )}
            {profile?.linkedin && (
              <Link
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            )}
            {profile?.email && (
              <Link
                href={`mailto:${profile.email}`}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Send email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Copyright + Admin link */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {year} {profile?.name ?? 'Huzaifa Nadeem'}. All rights reserved.
            </p>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-gray-300 dark:text-gray-700
                         hover:text-gray-500 dark:hover:text-gray-400
                         transition-colors"
              aria-label="Admin panel"
              title="Admin Panel"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
