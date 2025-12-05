/**
 * Distance calculation utilities using the Haversine formula
 * for calculating distances between two geographic coordinates
 */

const EARTH_RADIUS_KM = 6371
const EARTH_RADIUS_M = 6371000
const AVERAGE_WALKING_SPEED_KMH = 5 // 5 km/h average walking speed

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceMeters = EARTH_RADIUS_M * c

  return Math.round(distanceMeters)
}

/**
 * Calculate distance in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return calculateDistance(lat1, lon1, lat2, lon2) / 1000
}

/**
 * Estimate walking time between two coordinates
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @param walkingSpeedKmh Walking speed in km/h (default: 5 km/h)
 * @returns Estimated walking time in minutes
 */
export function estimateWalkTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  walkingSpeedKmh: number = AVERAGE_WALKING_SPEED_KMH
): number {
  const distanceKm = calculateDistanceKm(lat1, lon1, lat2, lon2)
  const timeHours = distanceKm / walkingSpeedKmh
  const timeMinutes = Math.round(timeHours * 60)

  return timeMinutes
}

/**
 * Format distance for display
 * @param distanceMeters Distance in meters
 * @returns Formatted string (e.g., "500 m" or "1.2 km")
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${distanceMeters} m`
  }
  const km = (distanceMeters / 1000).toFixed(1)
  return `${km} km`
}

/**
 * Format walking time for display
 * @param minutes Walking time in minutes
 * @returns Formatted string (e.g., "5 min" or "1 hr 15 min")
 */
export function formatWalkTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${remainingMinutes} min`
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a coordinate is within a radius
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param pointLat Point latitude
 * @param pointLon Point longitude
 * @param radiusMeters Radius in meters
 * @returns True if point is within radius
 */
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon)
  return distance <= radiusMeters
}

