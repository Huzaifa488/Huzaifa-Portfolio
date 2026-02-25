import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://huzaifanadeem.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Huzaifa Nadeem — Software Developer',
    template: '%s | Huzaifa Nadeem',
  },
  description:
    'Software Developer specialising in AI, Mobile Application Development, and Full-Stack Systems. Final-year BS Computer Science student.',
  keywords: [
    'Huzaifa Nadeem',
    'Software Developer',
    'Android Developer',
    'Machine Learning',
    'Full-Stack',
    'Next.js',
    'Computer Science',
    'Portfolio',
  ],
  authors: [{ name: 'Huzaifa Nadeem' }],
  creator: 'Huzaifa Nadeem',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Huzaifa Nadeem',
    title: 'Huzaifa Nadeem — Software Developer',
    description:
      'Software Developer specialising in AI, Mobile Application Development, and Full-Stack Systems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huzaifa Nadeem — Software Developer',
    description:
      'Software Developer specialising in AI, Mobile Application Development, and Full-Stack Systems.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
