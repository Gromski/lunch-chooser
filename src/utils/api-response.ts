import { NextResponse } from 'next/server'
import { formatErrorResponse } from './errors'

/**
 * Standard success response format
 */
export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  )
}

/**
 * Standard error response format
 */
export function errorResponse(error: unknown, statusCode?: number) {
  const formattedError = formatErrorResponse(error)
  const status = statusCode || formattedError.error.statusCode

  return NextResponse.json(
    {
      success: false,
      ...formattedError,
    },
    { status }
  )
}

/**
 * Paginated response format
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
}

/**
 * Created response (201)
 */
export function createdResponse<T>(data: T) {
  return successResponse(data, 201)
}

/**
 * No content response (204)
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 })
}

