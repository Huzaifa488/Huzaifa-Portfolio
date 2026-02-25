import { createClient } from '@/lib/supabase/server'
import { FolderKanban, Cpu, MessageSquare, User, Eye, Star } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: featuredProjects },
    { count: totalSkills },
    { count: totalMessages },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  return {
    totalProjects:   totalProjects   ?? 0,
    publishedProjects: publishedProjects ?? 0,
    featuredProjects:  featuredProjects  ?? 0,
    totalSkills:     totalSkills     ?? 0,
    totalMessages:   totalMessages   ?? 0,
    unreadMessages:  unreadMessages  ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const cards = [
    {
      label:   'Total Projects',
      value:   stats.totalProjects,
      sub:     `${stats.publishedProjects} published`,
      icon:    FolderKanban,
      color:   'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      href:    '/admin/projects',
    },
    {
      label:   'Featured Projects',
      value:   stats.featuredProjects,
      sub:     'Highlighted on portfolio',
      icon:    Star,
      color:   'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
      href:    '/admin/projects',
    },
    {
      label:   'Skills',
      value:   stats.totalSkills,
      sub:     'Across all categories',
      icon:    Cpu,
      color:   'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      href:    '/admin/skills',
    },
    {
      label:   'Messages',
      value:   stats.totalMessages,
      sub:     `${stats.unreadMessages} unread`,
      icon:    MessageSquare,
      color:   stats.unreadMessages > 0
                 ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                 : 'text-green-600 bg-green-50 dark:bg-green-900/20',
      href:    '/admin/messages',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your portfolio content.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(({ label, value, sub, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="card card-padding flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-150 group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Edit Profile',     href: '/admin/profile',          icon: User,          desc: 'Update bio, links, resume' },
            { label: 'Add Project',      href: '/admin/projects/new',     icon: FolderKanban,  desc: 'Create a new project entry' },
            { label: 'Manage Skills',    href: '/admin/skills',           icon: Cpu,           desc: 'Add or edit skill categories' },
            { label: 'View Messages',    href: '/admin/messages',         icon: MessageSquare, desc: `${stats.unreadMessages} unread messages` },
            { label: 'View Portfolio',   href: '/',                       icon: Eye,           desc: 'Open public-facing site' },
          ].map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800
                         hover:border-primary-300 dark:hover:border-primary-700
                         hover:bg-primary-50/30 dark:hover:bg-primary-900/10
                         transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                              group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
