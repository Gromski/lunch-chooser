import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createdResponse } from '@/utils/api-response'
import { validateRequest } from '@/lib/validation'
import { voteCreateSchema } from '@/lib/validation'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError, ValidationError, ForbiddenError } from '@/utils/errors'
import { logger } from '@/utils/logger'

/**
 * POST /api/v1/lunch-groups/:id/votes
 * Cast a vote for a restaurant in a lunch group
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const { id: lunchGroupId } = params
    
    const body = await validateRequest(request, voteCreateSchema)
    const { restaurantId } = body
    
    // Verify lunch group exists and get status
    const lunchGroup = await prisma.lunchGroup.findUnique({
      where: { id: lunchGroupId },
      include: {
        participants: true,
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
      return errorResponse(
        new ForbiddenError('You must be a participant to vote')
      )
    }
    
    // Check if group is in voting or planning status
    if (lunchGroup.status !== 'voting' && lunchGroup.status !== 'planning') {
      return errorResponse(
        new ValidationError('Voting is only allowed when group is in planning or voting status'),
        400
      )
    }
    
    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })
    
    if (!restaurant) {
      return errorResponse(new NotFoundError('Restaurant'))
    }
    
    // Check if user already voted for this restaurant
    const existingVote = await prisma.vote.findUnique({
      where: {
        lunchGroupId_userId_restaurantId: {
          lunchGroupId,
          userId: session.user.id,
          restaurantId,
        },
      },
    })
    
    if (existingVote) {
      return errorResponse(
        new ValidationError('You have already voted for this restaurant'),
        409
      )
    }
    
    // Create vote
    const vote = await prisma.vote.create({
      data: {
        lunchGroupId,
        userId: session.user.id,
        restaurantId,
      },
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
    })
    
    // Update group status to voting if it's still in planning
    if (lunchGroup.status === 'planning') {
      await prisma.lunchGroup.update({
        where: { id: lunchGroupId },
        data: { status: 'voting' },
      })
    }
    
    logger.info('Vote cast', {
      lunchGroupId,
      restaurantId,
      userId: session.user.id,
    })
    
    return createdResponse({
      vote: {
        id: vote.id,
        restaurantId: vote.restaurant.id,
        restaurantName: vote.restaurant.name,
        userId: vote.user.id,
        userName: vote.user.name,
        createdAt: vote.createdAt,
      },
    })
  } catch (error) {
    logger.error('Error casting vote', error)
    if (error instanceof ValidationError) {
      return errorResponse(error, 400)
    }
    return errorResponse(error)
  }
}

/**
 * GET /api/v1/lunch-groups/:id/votes
 * Get all votes for a lunch group
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const { id: lunchGroupId } = params
    
    // Verify lunch group exists
    const lunchGroup = await prisma.lunchGroup.findUnique({
      where: { id: lunchGroupId },
      include: {
        participants: true,
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
      return errorResponse(
        new ForbiddenError('You must be a participant to view votes')
      )
    }
    
    // Get all votes
    const votes = await prisma.vote.findMany({
      where: { lunchGroupId },
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
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Aggregate votes by restaurant
    const voteMap = new Map<string, { restaurant: any; votes: any[]; count: number }>()
    
    votes.forEach((vote) => {
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
    
    const aggregatedVotes = Array.from(voteMap.values())
      .map((entry) => ({
        restaurantId: entry.restaurant.id,
        restaurantName: entry.restaurant.name,
        restaurantAddress: entry.restaurant.address,
        voteCount: entry.count,
        voters: entry.votes.map((v) => ({
          userId: v.userId,
          userName: v.userName,
          votedAt: v.createdAt,
        })),
      }))
      .sort((a, b) => b.voteCount - a.voteCount) // Sort by vote count descending
    
    return successResponse({
      votes: aggregatedVotes,
      totalVotes: votes.length,
      totalRestaurants: aggregatedVotes.length,
    })
  } catch (error) {
    logger.error('Error fetching votes', error)
    return errorResponse(error)
  }
}

