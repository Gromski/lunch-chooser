import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createdResponse } from '@/utils/api-response'
import { validateRequest } from '@/lib/validation'
import { userRegistrationSchema, userUpdateSchema } from '@/lib/validation'
import { hash } from 'bcryptjs'
import { UnauthorizedError, ValidationError, NotFoundError } from '@/utils/errors'

/**
 * GET /api/v1/users
 * Get current user profile (requires authentication)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse(new UnauthorizedError('Authentication required'))
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        defaultLocationLat: true,
        defaultLocationLng: true,
        defaultLocationAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return errorResponse(new NotFoundError('User'))
    }

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * POST /api/v1/users
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await validateRequest(request, userRegistrationSchema)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return errorResponse(
        new ValidationError('User with this email already exists'),
        409
      )
    }

    // Hash password
    const passwordHash = await hash(body.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return createdResponse(user)
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error, 400)
    }
    return errorResponse(error)
  }
}

/**
 * PATCH /api/v1/users
 * Update current user profile (requires authentication)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse(new UnauthorizedError('Authentication required'))
    }

    const body = await validateRequest(request, userUpdateSchema)

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.defaultLocationLat && { defaultLocationLat: body.defaultLocationLat }),
        ...(body.defaultLocationLng && { defaultLocationLng: body.defaultLocationLng }),
        ...(body.defaultLocationAddress && { defaultLocationAddress: body.defaultLocationAddress }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        defaultLocationLat: true,
        defaultLocationLng: true,
        defaultLocationAddress: true,
        updatedAt: true,
      },
    })

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

