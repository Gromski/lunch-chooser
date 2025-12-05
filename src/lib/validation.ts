import { z } from 'zod'

/**
 * Common validation schemas
 */

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

/**
 * User validation schemas
 */

export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(100).optional(),
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: emailSchema.optional(),
  defaultLocationLat: z.number().min(-90).max(90).optional(),
  defaultLocationLng: z.number().min(-180).max(180).optional(),
  defaultLocationAddress: z.string().optional(),
})

/**
 * Restaurant validation schemas
 */

export const restaurantSearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive().max(5000).default(1000), // meters
  foodTypes: z.array(z.string()).optional(),
  establishmentType: z.string().optional(),
  maxWalkTime: z.number().positive().optional(), // minutes
})

/**
 * Lunch Group validation schemas
 */

export const lunchGroupCreateSchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  locationLat: z.number().min(-90).max(90),
  locationLng: z.number().min(-180).max(180),
  locationAddress: z.string().optional(),
})

export const lunchGroupUpdateSchema = z.object({
  status: z.enum(['planning', 'voting', 'decided', 'completed']).optional(),
  selectedRestaurantId: z.string().uuid().optional(),
})

/**
 * Vote validation schemas
 */

export const voteCreateSchema = z.object({
  restaurantId: z.string().uuid(),
})

/**
 * Visit History validation schemas
 */

export const visitHistoryCreateSchema = z.object({
  restaurantId: z.string().uuid(),
  visitedAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notes: z.string().optional(),
})

/**
 * Helper function to parse and validate request body
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await request.json()
  return schema.parse(body)
}

/**
 * Helper function to validate search params
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries())
  
  // Convert string numbers to actual numbers
  const converted: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === 'true') converted[key] = true
    else if (value === 'false') converted[key] = false
    else if (!isNaN(Number(value)) && value !== '') converted[key] = Number(value)
    else converted[key] = value
  }
  
  return schema.parse(converted)
}

