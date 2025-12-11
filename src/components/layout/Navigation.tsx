'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { href: '/groups', label: 'Groups', icon: Users, requiresAuth: true },
  { href: '/profile', label: 'Profile', icon: User, requiresAuth: true },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresAuth || isAuthenticated
  )

  return (
    <nav
      className="flex items-center gap-1"
      role="navigation"
      aria-label="Main navigation"
    >
      {visibleLinks.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
