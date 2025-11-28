/**
 * Error handling utilities for the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

/**
 * Error response formatter for API routes
 */
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code || 'ERROR',
        statusCode: error.statusCode,
        ...(error instanceof ValidationError && { field: error.field }),
      },
    }
  }

  if (error instanceof Error) {
    return {
      error: {
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    }
  }

  return {
    error: {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    },
  }
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error)
    if (context) {
      console.error('Context:', context)
    }
  }
  // In production, you would send to error tracking service (e.g., Sentry)
}

