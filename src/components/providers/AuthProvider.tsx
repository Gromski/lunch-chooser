'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface User {
  id: string
  email: string
  name: string | null
  defaultLocation: {
    latitude: number
    longitude: number
  } | null
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const isLoading = status === 'loading'

  useEffect(() => {
    if (session?.user) {
      // Fetch full user profile from API
      fetch('/api/v1/users')
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          return null
        })
        .then((data) => {
          if (data?.data) {
            setUser(data.data)
          }
        })
        .catch(() => {
          // Silently fail - user will be null
        })
    } else {
      setUser(null)
    }
  }, [session])

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
