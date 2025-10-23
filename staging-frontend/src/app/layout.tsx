import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Code24.dev - Your Website Improves Itself 24/7',
  description: 'Connect any existing site. AI Workers find problems, fix them, then optimize forever. Works with WordPress, Shopify, Wix, Custom Sites. Start $99/mo.',
  keywords: 'website optimization, AI workers, website improves itself, optimize existing website, WordPress optimization, Shopify optimization, website performance, SEO optimization',
  authors: [{ name: 'Code24.dev Team' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/favicon.svg'
  },
  openGraph: {
    title: 'Code24.dev - Your Website Improves Itself 24/7',
    description: 'Connect any existing site. AI Workers find problems, fix them, then optimize forever.',
    url: 'https://staging.code24.dev',
    siteName: 'Code24.dev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code24.dev - Your Website Improves Itself 24/7',
    description: 'Connect any existing site. AI Workers find problems, fix them, then optimize forever.',
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