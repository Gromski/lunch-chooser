import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Providers } from '@/components/providers/Providers'

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
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}



