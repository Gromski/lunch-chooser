import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lunch Chooser',
  description: 'A location-based web application that helps office teams quickly decide where to eat lunch',
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



