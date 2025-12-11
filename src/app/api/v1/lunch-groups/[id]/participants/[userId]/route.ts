import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/utils/api-response'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError, ForbiddenError, ValidationError } from '@/utils/errors'
import { logger } from '@/utils/logger'

/**
 * DELETE /api/v1/lunch-groups/:id/participants/:userId
 * Remove a participant from the lunch group
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await requireAuth()
    const { id: lunchGroupId, userId } = params
    
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
    
    // Check permissions: user can remove themselves or creator can remove anyone
    const isRemovingSelf = userId === session.user.id
    const isCreator = lunchGroup.createdById === session.user.id
    const isParticipant = lunchGroup.participants.some(
      (p) => p.userId === session.user.id
    )
    
    if (!isRemovingSelf && !isCreator) {
      return errorResponse(
        new ForbiddenError('Only the creator can remove other participants')
      )
    }
    
    if (!isParticipant) {
      return errorResponse(
        new ForbiddenError('You must be a participant to perform this action')
      )
    }
    
    // Check if participant exists
    const participant = lunchGroup.participants.find((p) => p.userId === userId)
    
    if (!participant) {
      return errorResponse(new NotFoundError('Participant'))
    }
    
    // Don't allow removing the creator if they're the only participant
    if (lunchGroup.createdById === userId && lunchGroup.participants.length === 1) {
      return errorResponse(
        new ValidationError('Cannot remove the only participant'),
        400
      )
    }
    
    // Remove participant
    await prisma.lunchGroupParticipant.delete({
      where: {
        lunchGroupId_userId: {
          lunchGroupId,
          userId,
        },
      },
    })
    
    // Recalculate aggregated dietary requirements
    const remainingParticipants = await prisma.lunchGroupParticipant.findMany({
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
    
    const dietaryRequirementSet = new Set<string>()
    remainingParticipants.forEach((participant) => {
      participant.user.dietaryRequirements.forEach((dr) => {
        dietaryRequirementSet.add(dr.dietaryRequirement.id)
      })
    })
    
    const aggregatedRequirements = Array.from(dietaryRequirementSet)
    
    // Update lunch group
    const updatedGroup = await prisma.lunchGroup.update({
      where: { id: lunchGroupId },
      data: {
        aggregatedDietaryRequirements: aggregatedRequirements,
      },
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
    
    logger.info('Removed participant from lunch group', {
      lunchGroupId,
      userId,
      removedBy: session.user.id,
    })
    
    return successResponse({
      message: 'Participant removed',
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
    logger.error('Error removing participant', error)
    return errorResponse(error)
  }
}

