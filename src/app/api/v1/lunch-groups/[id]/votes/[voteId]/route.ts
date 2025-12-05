import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, noContentResponse } from '@/utils/api-response'
import { requireAuth } from '@/lib/auth-helpers'
import { NotFoundError, ForbiddenError } from '@/utils/errors'
import { logger } from '@/utils/logger'

/**
 * DELETE /api/v1/lunch-groups/:id/votes/:voteId
 * Remove a vote from a lunch group
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; voteId: string } }
) {
  try {
    const session = await requireAuth()
    const { id: lunchGroupId, voteId } = params
    
    // Verify vote exists and belongs to the lunch group
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        lunchGroup: {
          include: {
            participants: true,
          },
        },
      },
    })
    
    if (!vote) {
      return errorResponse(new NotFoundError('Vote'))
    }
    
    if (vote.lunchGroupId !== lunchGroupId) {
      return errorResponse(new NotFoundError('Vote'))
    }
    
    // Check permissions: user can only remove their own vote
    if (vote.userId !== session.user.id) {
      return errorResponse(
        new ForbiddenError('You can only remove your own votes')
      )
    }
    
    // Check if group is still in voting/planning status
    if (vote.lunchGroup.status !== 'voting' && vote.lunchGroup.status !== 'planning') {
      return errorResponse(
        new ForbiddenError('Cannot remove votes when group is not in voting or planning status'),
        400
      )
    }
    
    // Delete the vote
    await prisma.vote.delete({
      where: { id: voteId },
    })
    
    logger.info('Vote removed', {
      lunchGroupId,
      voteId,
      userId: session.user.id,
    })
    
    return noContentResponse()
  } catch (error) {
    logger.error('Error removing vote', error)
    return errorResponse(error)
  }
}

