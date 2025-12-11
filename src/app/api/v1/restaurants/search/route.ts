import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchRestaurants, googlePlaceToRestaurant } from '@/lib/google-places'
import { validateSearchParams } from '@/lib/validation'
import { restaurantSearchSchema } from '@/lib/validation'
import { successResponse, errorResponse } from '@/utils/api-response'
import { calculateDistance, estimateWalkTime } from '@/utils/distance'
import { logger } from '@/utils/logger'

const CACHE_DURATION_HOURS = 24

/**
 * GET /api/v1/restaurants/search
 * Search for restaurants near a location
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = validateSearchParams(searchParams, restaurantSearchSchema)

    const { latitude, longitude, radius, foodTypes, establishmentType, maxWalkTime } = params

    logger.info('Restaurant search request', { latitude, longitude, radius })

    // Search Google Places API
    const query = 'restaurant'
    const googlePlaces = await searchRestaurants(
      query,
      latitude,
      longitude,
      radius || 1000,
      20
    )

    logger.info(`Found ${googlePlaces.length} places from Google Places API`)

    // Process and cache restaurants
    const restaurants = (await Promise.all(
      googlePlaces.map(async (place) => {
        const restaurantData = googlePlaceToRestaurant(place)

        // Check if restaurant exists in cache
        let restaurant = await prisma.restaurant.findUnique({
          where: { googlePlaceId: restaurantData.googlePlaceId },
        })

        // Update cache if expired or doesn't exist
        const shouldUpdateCache =
          !restaurant ||
          !restaurant.lastCachedAt ||
          new Date(restaurant.lastCachedAt).getTime() <
            Date.now() - CACHE_DURATION_HOURS * 60 * 60 * 1000

        if (shouldUpdateCache) {
          const updateData: any = {
            ...restaurantData,
            lastCachedAt: new Date(),
          }
          
          // Handle JSON field properly
          if (updateData.openingHours) {
            updateData.openingHours = typeof updateData.openingHours === 'string' 
              ? JSON.parse(updateData.openingHours) 
              : updateData.openingHours
          }

          if (restaurant) {
            // Update existing
            restaurant = await prisma.restaurant.update({
              where: { id: restaurant.id },
              data: updateData,
            })
          } else {
            // Create new
            restaurant = await prisma.restaurant.create({
              data: updateData,
            })
          }
        }

        // Skip if restaurant creation/update failed
        if (!restaurant) {
          return null
        }

        // Calculate distance and walk time
        const distanceMeters = calculateDistance(
          latitude,
          longitude,
          restaurant.latitude.toNumber(),
          restaurant.longitude.toNumber()
        )
        const walkTimeMinutes = estimateWalkTime(
          latitude,
          longitude,
          restaurant.latitude.toNumber(),
          restaurant.longitude.toNumber()
        )

        return {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          latitude: restaurant.latitude.toNumber(),
          longitude: restaurant.longitude.toNumber(),
          foodTypes: restaurant.foodTypes,
          establishmentType: restaurant.establishmentType,
          priceLevel: restaurant.priceLevel,
          rating: restaurant.rating?.toNumber() || null,
          userRatingsTotal: restaurant.userRatingsTotal,
          distance: distanceMeters,
          walkTime: walkTimeMinutes,
          visitCount: restaurant.visitCount,
          lastVisitedAt: restaurant.lastVisitedAt,
        }
      })
    )).filter((r): r is NonNullable<typeof r> => r !== null)

    // Apply filters
    let filteredRestaurants = restaurants

    if (foodTypes && foodTypes.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((r) =>
        r.foodTypes.some((type) => foodTypes.includes(type))
      )
    }

    if (establishmentType) {
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.establishmentType === establishmentType
      )
    }

    if (maxWalkTime) {
      filteredRestaurants = filteredRestaurants.filter((r) => r.walkTime <= maxWalkTime)
    }

    // Sort by distance
    filteredRestaurants.sort((a, b) => a.distance - b.distance)

    logger.info(`Returning ${filteredRestaurants.length} filtered restaurants`)

    return successResponse({
      restaurants: filteredRestaurants,
      count: filteredRestaurants.length,
    })
  } catch (error) {
    logger.error('Error searching restaurants', error)
    return errorResponse(error)
  }
}

