'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * Floating Admin Button — visible only after scrolling 200 px.
 * Sits in the bottom-left corner so it doesn't overlap the content.
 * Links to /admin (middleware redirects to /admin/login if not logged in).
 */
export function AdminFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Link
      href="/admin"
      aria-label="Open admin panel"
      title="Admin Panel"
      className={`
        fixed bottom-6 left-6 z-40
        flex items-center gap-2
        px-3 py-2 rounded-full
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        text-gray-500 dark:text-gray-400 text-xs font-medium
        shadow-card hover:shadow-card-hover
        hover:text-primary-600 dark:hover:text-primary-400
        hover:border-primary-300 dark:hover:border-primary-700
        transition-all duration-200
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <Settings className="w-3.5 h-3.5" />
      Admin
    </Link>
  )
}
