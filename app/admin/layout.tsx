import { createClient }   from '@/lib/supabase/server'
import { AdminSidebar }   from '@/components/admin/AdminSidebar'
import { ThemeToggle }    from '@/components/ui/ThemeToggle'

export const metadata = {
  title: 'Admin — Portfolio CMS',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Not authenticated ─────────────────────────────────────────────
  // Render children directly (the login page) without any admin chrome.
  // The middleware already handles redirecting /admin/* → /admin/login,
  // so we never reach here for protected pages when unauthenticated.
  if (!user) {
    return <>{children}</>
  }

  // ── Authenticated ─────────────────────────────────────────────────
  // Render the full CMS shell: sidebar + top-bar + content area.
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 px-6 flex items-center justify-between
                     bg-white dark:bg-gray-900
                     border-b border-gray-200 dark:border-gray-800 shrink-0"
        >
          <div />
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {user.email}
            </p>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
