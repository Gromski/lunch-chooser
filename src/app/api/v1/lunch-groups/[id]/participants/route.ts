import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/utils/api-response'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError, ForbiddenError, ValidationError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { z } from 'zod'

const addParticipantSchema = z.object({
  userId: z.string().uuid(),
})

/**
 * POST /api/v1/lunch-groups/:id/participants
 * Add a participant to the lunch group
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const { id: lunchGroupId } = params
    
    const body = await request.json()
    const { userId } = addParticipantSchema.parse(body)
    
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
    
    // Check if requester is already a participant
    const requesterIsParticipant = lunchGroup.participants.some(
      (p) => p.userId === session.user.id
    )
    
    if (!requesterIsParticipant) {
      return errorResponse(
        new ForbiddenError('You must be a participant to add others')
      )
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      return errorResponse(new NotFoundError('User'))
    }
    
    // Check if already a participant
    const alreadyParticipant = lunchGroup.participants.some(
      (p) => p.userId === userId
    )
    
    if (alreadyParticipant) {
      return errorResponse(
        new ValidationError('User is already a participant'),
        400
      )
    }
    
    // Add participant
    await prisma.lunchGroupParticipant.create({
      data: {
        lunchGroupId,
        userId,
      },
    })
    
    // Get all participants with their dietary requirements
    const allParticipants = await prisma.lunchGroupParticipant.findMany({
      where: { lunchGroupId },
      include: {
        user: {
          include: {
            dietaryRequirements: {
              include: {
                dietaryRequirement: true,
              },
            },
          },
        },
      },
    })
    
    // Aggregate dietary requirements (union of all participants)
    const dietaryRequirementSet = new Set<string>()
    allParticipants.forEach((participant) => {
      participant.user.dietaryRequirements.forEach((dr) => {
        dietaryRequirementSet.add(dr.dietaryRequirement.id)
      })
    })
    
    const aggregatedRequirements = Array.from(dietaryRequirementSet)
    
    // Update lunch group with aggregated dietary requirements
    await prisma.lunchGroup.update({
      where: { id: lunchGroupId },
      data: {
        aggregatedDietaryRequirements: aggregatedRequirements,
      },
    })
    
    // Fetch updated group
    const updatedGroup = await prisma.lunchGroup.findUnique({
      where: { id: lunchGroupId },
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
      },
    })
    
    if (!updatedGroup) {
      throw new NotFoundError('LunchGroup')
    }
    
    logger.info('Added participant to lunch group', {
      lunchGroupId,
      userId,
      addedBy: session.user.id,
    })
    
    return successResponse({
      participant: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: new Date(),
      },
      lunchGroup: {
        id: updatedGroup.id,
        aggregatedDietaryRequirements: updatedGroup.aggregatedDietaryRequirements,
        participants: updatedGroup.participants.map((p) => ({
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
          joinedAt: p.joinedAt,
        })),
      },
    })
  } catch (error) {
    logger.error('Error adding participant', error)
    if (error instanceof z.ZodError) {
      return errorResponse(new ValidationError(error.errors[0].message), 400)
    }
    return errorResponse(error)
  }
}

