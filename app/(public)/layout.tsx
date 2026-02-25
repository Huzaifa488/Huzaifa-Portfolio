import { Navbar }    from '@/components/layout/Navbar'
import { Footer }    from '@/components/layout/Footer'
import { AdminFab }  from '@/components/layout/AdminFab'
import { getProfile } from '@/lib/queries'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} />
      {/* Floating admin entry point — visible after scrolling */}
      <AdminFab />
    </>
  )
}
