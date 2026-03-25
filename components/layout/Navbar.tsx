'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'About',    href: '#about'     },
  { label: 'Skills',   href: '#skills'    },
  { label: 'Projects', href: '#projects'  },
  { label: 'Education',href: '#education' },
  { label: 'Contact',  href: '#contact'   },
]

export function Navbar() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [isScrolled,  setIsScrolled]  = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Detect scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observer to highlight active nav section
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNavClick = () => setIsOpen(false)

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md',
        isScrolled && 'shadow-sm border-b border-gray-200/80 dark:border-gray-800/80'
      )}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Animated monogram badge */}
            <div className="relative w-9 h-9 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out">
              {/* Spinning conic gradient ring */}
              <div className="absolute inset-[-2px] rounded-[10px] animate-spin-slow logo-ring opacity-90 group-hover:opacity-100 transition-opacity" />
              {/* Glow pulse layer */}
              <div className="absolute inset-[-4px] rounded-[12px] animate-logo-glow opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.6) 0%, transparent 70%)' }}
              />
              {/* Badge body */}
              <div
                className="relative w-full h-full rounded-[8px] flex items-center justify-center z-10"
                style={{ background: 'linear-gradient(140deg, #1e3a8a 0%, #4c1d95 60%, #1e1b4b 100%)' }}
              >
                {/* Subtle inner shimmer */}
                <div className="absolute inset-0 rounded-[8px] opacity-20"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)' }}
                />
                <span className="relative font-mono font-bold text-[9px] text-white/95 tracking-tight leading-none select-none">
                  &lt;HN/&gt;
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col leading-none gap-px">
              <span className="gradient-text font-bold text-[15px] tracking-tight">
                Huzaifa Nadeem
              </span>
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase group-hover:text-primary-400 transition-colors duration-300">
                Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  activeSection === link.href.slice(1)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-3 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeSection === link.href.slice(1)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
