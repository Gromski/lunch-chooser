# Restaurant API Endpoints

## Overview
This document details all API endpoints related to restaurant discovery, search, and management.

## Base Path
`/api/v1/restaurants`

## Endpoints

### Search Nearby Restaurants
**GET** `/api/v1/restaurants/search`

**Description**: Search for restaurants near a location with optional filters

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in meters (default: 1000)
- `foodTypes` (optional): Comma-separated food type IDs
- `establishmentType` (optional): sit-down, takeaway, café
- `maxDistance` (optional): Maximum distance in meters
- `maxWalkTime` (optional): Maximum walk time in minutes
- `excludeRecent` (optional): Exclude restaurants visited in last N days (default: 1)
- `dietaryRequirements` (optional): Comma-separated dietary requirement IDs
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Results per page (default: 20)

**Response (200 OK):**
```json
{
  "restaurants": [
    {
      "id": "rest_abc123",
      "name": "Joe's Pizza",
      "address": "123 Food St, New York, NY",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "foodTypes": ["pizza", "italian"],
      "establishmentType": "sit-down",
      "priceLevel": 2,
      "rating": 4.5,
      "userRatingsTotal": 1250,
      "distance": 500,
      "walkTime": 6,
      "recentlyVisited": false,
      "visitCount": 5
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2
  }
}
```

**Errors:**
- `400`: Invalid coordinates or parameters
- `422`: Validation errors

---

### Get Restaurant Details
**GET** `/api/v1/restaurants/:id`

**Description**: Get detailed information about a specific restaurant

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "rest_abc123",
    "name": "Joe's Pizza",
    "address": "123 Food St, New York, NY",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "foodTypes": ["pizza", "italian"],
    "categories": [
      {"id": "cat_italian", "name": "Italian"}
    ],
    "establishmentType": "sit-down",
    "priceLevel": 2,
    "rating": 4.5,
    "userRatingsTotal": 1250,
    "openingHours": {
      "monday": "11:00-22:00",
      "tuesday": "11:00-22:00"
    },
    "phoneNumber": "+1234567890",
    "website": "https://joespizza.com",
    "photoUrl": "https://...",
    "visitCount": 5,
    "lastVisitedAt": "2024-01-15T12:00:00Z"
  }
}
```

**Errors:**
- `404`: Restaurant not found

---

### Refresh Restaurant Data
**POST** `/api/v1/restaurants/:id/refresh`

**Description**: Force refresh restaurant data from Google Places API

**Authentication**: Required (admin or system)

**Response (200 OK):**
```json
{
  "restaurant": {
    // Updated restaurant data
  },
  "cachedAt": "2024-01-20T12:00:00Z"
}
```

**Errors:**
- `401`: Not authenticated
- `403`: Insufficient permissions
- `404`: Restaurant not found

---

## Implementation Notes

### Google Places API Integration
- Server-side proxy for all Google Places API calls
- API key stored in environment variables
- Rate limiting to manage API costs
- Caching strategy: 24-hour cache for restaurant data

### Geospatial Queries
- Uses PostGIS for location-based queries
- Distance calculation using ST_Distance
- Efficient spatial indexing with GIST

### Filtering Logic
- Dietary requirements: Filter by restaurant categories
- Distance: PostGIS spatial queries
- Walk time: Calculated from distance (average walking speed)
- Recent visits: Exclude based on VisitHistory

### Ranking Algorithm
- Distance (closer = higher rank)
- Rating (higher = higher rank)
- Visit frequency (more visits = higher rank, Phase 2)
- New restaurant boost (surfaces new options, Phase 2)

