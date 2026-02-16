import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tetris Hockey',
  description: 'A Tetris hockey game',
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
