import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Code24.dev - Revolutionary AI Website Platform',
  description: 'The only platform where AI continuously improves your website. Build or optimize with our Elite Worker AI system.',
  keywords: 'AI website builder, website optimization, machine learning, continuous improvement, elite workers',
  authors: [{ name: 'Code24.dev Team' }],
  openGraph: {
    title: 'Code24.dev - Revolutionary AI Website Platform',
    description: 'The only platform where AI continuously improves your website',
    url: 'https://staging.code24.dev',
    siteName: 'Code24.dev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code24.dev - Revolutionary AI Website Platform',
    description: 'The only platform where AI continuously improves your website',
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