import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tetris Hockey',
  description: 'Stack blocks, clear lines, and channel your inner Gretzky.',
  keywords: ['tetris', 'hockey', 'game', 'puzzle'],
  openGraph: {
    title: 'Tetris Hockey',
    description: 'Stack blocks, clear lines, and channel your inner Gretzky.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06091a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
