'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from './AuthProvider'
import { LocationProvider } from './LocationProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LocationProvider>{children}</LocationProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
