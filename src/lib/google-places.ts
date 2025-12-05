/**
 * Google Places API client
 * Handles restaurant search and data fetching from Google Places API (New)
 */

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1'

if (!GOOGLE_PLACES_API_KEY) {
  console.warn('GOOGLE_PLACES_API_KEY is not set. Google Places API will not work.')
}

export interface GooglePlace {
  id: string
  displayName: { text: string; languageCode: string }
  formattedAddress: string
  location: {
    latitude: number
    longitude: number
  }
  types: string[]
  rating?: number
  userRatingCount?: number
  priceLevel?: 'PRICE_LEVEL_FREE' | 'PRICE_LEVEL_INEXPENSIVE' | 'PRICE_LEVEL_MODERATE' | 'PRICE_LEVEL_EXPENSIVE' | 'PRICE_LEVEL_VERY_EXPENSIVE'
  openingHours?: {
    openNow: boolean
    weekdayDescriptions: string[]
  }
  photos?: Array<{
    name: string
    widthPx: number
    heightPx: number
  }>
  websiteUri?: string
  nationalPhoneNumber?: string
}

export interface SearchTextRequest {
  textQuery: string
  locationBias?: {
    circle: {
      center: {
        latitude: number
        longitude: number
      }
      radius: number // in meters
    }
  }
  maxResultCount?: number
  includedType?: string // e.g., "restaurant"
  languageCode?: string
}

export interface SearchTextResponse {
  places: GooglePlace[]
}

/**
 * Search for restaurants using Google Places API
 */
export async function searchRestaurants(
  query: string,
  latitude: number,
  longitude: number,
  radius: number = 1000,
  maxResults: number = 20
): Promise<GooglePlace[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('GOOGLE_PLACES_API_KEY is not configured')
  }

  const requestBody: SearchTextRequest = {
    textQuery: query,
    locationBias: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius,
      },
    },
    maxResultCount: maxResults,
    includedType: 'restaurant',
    languageCode: 'en',
  }

  try {
    const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.priceLevel,places.openingHours,places.photos,places.websiteUri,places.nationalPhoneNumber',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(`Google Places API error: ${JSON.stringify(error)}`)
    }

    const data: SearchTextResponse = await response.json()
    return data.places || []
  } catch (error) {
    console.error('Error searching restaurants:', error)
    throw error
  }
}

/**
 * Get place details by place ID
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('GOOGLE_PLACES_API_KEY is not configured')
  }

  try {
    const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'id,displayName,formattedAddress,location,types,rating,userRatingCount,priceLevel,openingHours,photos,websiteUri,nationalPhoneNumber',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(`Google Places API error: ${JSON.stringify(error)}`)
    }

    const place: GooglePlace = await response.json()
    return place
  } catch (error) {
    console.error('Error getting place details:', error)
    throw error
  }
}

/**
 * Convert Google Place to our Restaurant format
 */
export function googlePlaceToRestaurant(place: GooglePlace) {
  // Map Google price levels to numeric values
  const priceLevelMap: Record<string, number> = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  }

  // Extract food types from place types
  const foodTypes = place.types.filter((type) =>
    type.includes('_restaurant') || type.includes('food')
  )

  // Determine establishment type
  let establishmentType = 'sit-down'
  if (place.types.includes('meal_takeaway') || place.types.includes('food')) {
    establishmentType = 'takeaway'
  }
  if (place.types.includes('cafe') || place.types.includes('bakery')) {
    establishmentType = 'café'
  }

  return {
    id: place.id,
    name: place.displayName.text,
    address: place.formattedAddress,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    googlePlaceId: place.id,
    foodTypes,
    establishmentType,
    priceLevel: place.priceLevel ? priceLevelMap[place.priceLevel] : null,
    rating: place.rating ? Number(place.rating.toFixed(2)) : null,
    userRatingsTotal: place.userRatingCount || 0,
    openingHours: place.openingHours ? JSON.stringify(place.openingHours) : null,
    phoneNumber: place.nationalPhoneNumber || null,
    website: place.websiteUri || null,
    photoUrl: place.photos && place.photos.length > 0 ? place.photos[0].name : null,
  }
}

