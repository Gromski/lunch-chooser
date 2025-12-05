import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createdResponse } from '@/utils/api-response'
import { validateRequest } from '@/lib/validation'
import { lunchGroupCreateSchema, paginationSchema } from '@/lib/validation'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'

/**
 * GET /api/v1/lunch-groups
 * Get active lunch groups (optionally filtered by date/status/userId)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId') || session.user.id
    
    // Build where clause
    const where: any = {}
    
    if (date) {
      where.date = new Date(date)
    } else {
      // Default to today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      where.date = today
    }
    
    if (status) {
      where.status = status
    }
    
    // Filter by participant
    if (userId) {
      where.participants = {
        some: {
          userId,
        },
      }
    }
    
    const lunchGroups = await prisma.lunchGroup.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 groups
    })
    
    const formattedGroups = lunchGroups.map((group) => ({
      id: group.id,
      date: group.date,
      status: group.status,
      locationLat: group.locationLat.toNumber(),
      locationLng: group.locationLng.toNumber(),
      locationAddress: group.locationAddress,
      participantCount: group._count.participants,
      voteCount: group._count.votes,
      createdAt: group.createdAt,
    }))
    
    return successResponse({
      lunchGroups: formattedGroups,
      count: formattedGroups.length,
    })
  } catch (error) {
    logger.error('Error fetching lunch groups', error)
    return errorResponse(error)
  }
}

/**
 * POST /api/v1/lunch-groups
 * Create a new lunch group
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await validateRequest(request, lunchGroupCreateSchema)
    
    // Parse date
    const date = new Date(body.date)
    date.setHours(0, 0, 0, 0)
    
    // Create lunch group
    const lunchGroup = await prisma.lunchGroup.create({
      data: {
        date,
        locationLat: body.locationLat,
        locationLng: body.locationLng,
        locationAddress: body.locationAddress,
        createdById: session.user.id,
        aggregatedDietaryRequirements: [], // Will be updated when participants are added
        status: 'planning',
      },
    })
    
    // Add creator as first participant
    await prisma.lunchGroupParticipant.create({
      data: {
        lunchGroupId: lunchGroup.id,
        userId: session.user.id,
      },
    })
    
    // Fetch complete group with participants
    const completeGroup = await prisma.lunchGroup.findUnique({
      where: { id: lunchGroup.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    
    if (!completeGroup) {
      throw new NotFoundError('LunchGroup')
    }
    
    const formattedGroup = {
      id: completeGroup.id,
      date: completeGroup.date,
      status: completeGroup.status,
      locationLat: completeGroup.locationLat.toNumber(),
      locationLng: completeGroup.locationLng.toNumber(),
      locationAddress: completeGroup.locationAddress,
      aggregatedDietaryRequirements: completeGroup.aggregatedDietaryRequirements,
      participants: completeGroup.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        joinedAt: p.joinedAt,
      })),
      createdAt: completeGroup.createdAt,
      updatedAt: completeGroup.updatedAt,
    }
    
    logger.info('Created lunch group', { groupId: lunchGroup.id, userId: session.user.id })
    
    return createdResponse({ lunchGroup: formattedGroup })
  } catch (error) {
    logger.error('Error creating lunch group', error)
    return errorResponse(error)
  }
}

