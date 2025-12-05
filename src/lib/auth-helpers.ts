/**
 * Authentication helper functions for use in API routes
 * These work with NextAuth v5 (Auth.js)
 */

import { auth } from '@/app/api/auth/[...nextauth]/route'
import { UnauthorizedError } from '@/utils/errors'

/**
 * Get the current session in an API route
 * Use this for NextAuth v5
 */
export async function getCurrentSession() {
  const session = await auth()
  return session
}

/**
 * Require authentication in an API route
 * Throws UnauthorizedError if not authenticated
 */
export async function requireAuth() {
  const session = await getCurrentSession()
  
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required')
  }
  
  return session
}

/**
 * Get the current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user?.id || null
}
