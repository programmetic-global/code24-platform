import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Code24.dev - Your Website Beats Competition Every Day',
  description: 'Revolutionary AI Worker team that makes your website beat competitors 24/7. BUILD from $99/mo or OPTIMIZE existing sites from $149/mo.',
  keywords: 'AI workers, website beats competition, competitive advantage, AI website builder, learning website, GEO optimization, AI search engines',
  authors: [{ name: 'Code24.dev Team' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/favicon.svg'
  },
  openGraph: {
    title: 'Code24.dev - Your Website Beats Competition Every Day',
    description: 'Revolutionary AI Worker team that makes your website beat competitors 24/7',
    url: 'https://staging.code24.dev',
    siteName: 'Code24.dev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code24.dev - Your Website Beats Competition Every Day',
    description: 'Revolutionary AI Worker team that makes your website beat competitors 24/7',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}