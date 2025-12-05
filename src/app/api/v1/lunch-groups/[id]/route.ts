import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/utils/api-response'
import { validateRequest } from '@/lib/validation'
import { lunchGroupUpdateSchema } from '@/lib/validation'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError, ForbiddenError } from '@/utils/errors'
import { logger } from '@/utils/logger'

/**
 * GET /api/v1/lunch-groups/:id
 * Get detailed information about a lunch group
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const { id } = params
    
    const lunchGroup = await prisma.lunchGroup.findUnique({
      where: { id },
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
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            restaurant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        selectedRestaurant: {
          select: {
            id: true,
            name: true,
            address: true,
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
    
    if (!lunchGroup) {
      return errorResponse(new NotFoundError('LunchGroup'))
    }
    
    // Check if user is a participant
    const isParticipant = lunchGroup.participants.some(
      (p) => p.userId === session.user.id
    )
    
    if (!isParticipant) {
      return errorResponse(new ForbiddenError('You must be a participant to view this group'))
    }
    
    // Aggregate votes by restaurant
    const voteMap = new Map<string, { restaurant: any; votes: any[]; count: number }>()
    
    lunchGroup.votes.forEach((vote) => {
      const restaurantId = vote.restaurantId
      if (!voteMap.has(restaurantId)) {
        voteMap.set(restaurantId, {
          restaurant: vote.restaurant,
          votes: [],
          count: 0,
        })
      }
      const entry = voteMap.get(restaurantId)!
      entry.votes.push({
        userId: vote.user.id,
        userName: vote.user.name,
        createdAt: vote.createdAt,
      })
      entry.count++
    })
    
    const aggregatedVotes = Array.from(voteMap.values()).map((entry) => ({
      restaurantId: entry.restaurant.id,
      restaurantName: entry.restaurant.name,
      voteCount: entry.count,
      voters: entry.votes.map((v) => ({
        userId: v.userId,
        userName: v.userName,
      })),
    }))
    
    const formattedGroup = {
      id: lunchGroup.id,
      date: lunchGroup.date,
      status: lunchGroup.status,
      locationLat: lunchGroup.locationLat.toNumber(),
      locationLng: lunchGroup.locationLng.toNumber(),
      locationAddress: lunchGroup.locationAddress,
      aggregatedDietaryRequirements: lunchGroup.aggregatedDietaryRequirements,
      participants: lunchGroup.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        joinedAt: p.joinedAt,
      })),
      votes: aggregatedVotes,
      selectedRestaurant: lunchGroup.selectedRestaurant,
      createdAt: lunchGroup.createdAt,
      updatedAt: lunchGroup.updatedAt,
    }
    
    return successResponse({ lunchGroup: formattedGroup })
  } catch (error) {
    logger.error('Error fetching lunch group', error)
    return errorResponse(error)
  }
}

/**
 * PATCH /api/v1/lunch-groups/:id
 * Update lunch group (status, selected restaurant, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const { id } = params
    const body = await validateRequest(request, lunchGroupUpdateSchema)
    
    // Check if group exists and user is participant
    const existingGroup = await prisma.lunchGroup.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    })
    
    if (!existingGroup) {
      return errorResponse(new NotFoundError('LunchGroup'))
    }
    
    const isParticipant = existingGroup.participants.some(
      (p) => p.userId === session.user.id
    )
    
    if (!isParticipant) {
      return errorResponse(new ForbiddenError('You must be a participant to update this group'))
    }
    
    // Prepare update data
    const updateData: any = {}
    
    if (body.status) {
      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        planning: ['voting'],
        voting: ['decided', 'planning'],
        decided: ['completed', 'voting'],
        completed: [],
      }
      
      const allowedStatuses = validTransitions[existingGroup.status] || []
      if (!allowedStatuses.includes(body.status)) {
        return errorResponse(
          new ValidationError(
            `Cannot transition from ${existingGroup.status} to ${body.status}`
          ),
          400
        )
      }
      
      updateData.status = body.status
    }
    
    if (body.selectedRestaurantId) {
      // Verify restaurant exists
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: body.selectedRestaurantId },
      })
      
      if (!restaurant) {
        return errorResponse(new NotFoundError('Restaurant'))
      }
      
      updateData.selectedRestaurantId = body.selectedRestaurantId
      
      // Auto-update status if not already decided
      if (existingGroup.status !== 'decided' && existingGroup.status !== 'completed') {
        updateData.status = 'decided'
      }
    }
    
    // Update the group
    const updatedGroup = await prisma.lunchGroup.update({
      where: { id },
      data: updateData,
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
        selectedRestaurant: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    })
    
    const formattedGroup = {
      id: updatedGroup.id,
      date: updatedGroup.date,
      status: updatedGroup.status,
      locationLat: updatedGroup.locationLat.toNumber(),
      locationLng: updatedGroup.locationLng.toNumber(),
      locationAddress: updatedGroup.locationAddress,
      aggregatedDietaryRequirements: updatedGroup.aggregatedDietaryRequirements,
      participants: updatedGroup.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        joinedAt: p.joinedAt,
      })),
      selectedRestaurant: updatedGroup.selectedRestaurant,
      createdAt: updatedGroup.createdAt,
      updatedAt: updatedGroup.updatedAt,
    }
    
    logger.info('Updated lunch group', { groupId: id, updates: Object.keys(updateData) })
    
    return successResponse({ lunchGroup: formattedGroup })
  } catch (error) {
    logger.error('Error updating lunch group', error)
    return errorResponse(error)
  }
}

