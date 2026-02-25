'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  MessageSquare,
  User,
  LogOut,
  Code2,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin',          icon: LayoutDashboard },
  { label: 'Profile',    href: '/admin/profile',   icon: User           },
  { label: 'Projects',   href: '/admin/projects',  icon: FolderKanban   },
  { label: 'Skills',     href: '/admin/skills',    icon: Cpu            },
  { label: 'Messages',   href: '/admin/messages',  icon: MessageSquare  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-white dark:bg-gray-900
                      border-r border-gray-200 dark:border-gray-800 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Portfolio CMS</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn('admin-link', isActive && 'admin-link-active')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="admin-link"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="admin-link w-full text-left text-red-500 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
