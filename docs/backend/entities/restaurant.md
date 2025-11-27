# Restaurant Entity

## Overview
The Restaurant entity caches restaurant data from Google Places API with additional metadata for filtering, ranking, and visit tracking.

## Database Schema
```sql
CREATE TABLE "Restaurant" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  location POINT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  googlePlaceId TEXT UNIQUE NOT NULL,
  foodTypes TEXT[],
  establishmentType TEXT,
  priceLevel INTEGER,
  rating DECIMAL(3, 2),
  userRatingsTotal INTEGER,
  openingHours JSONB,
  phoneNumber TEXT,
  website TEXT,
  photoUrl TEXT,
  lastCachedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visitCount INTEGER DEFAULT 0,
  lastVisitedAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships
- **One-to-Many**: Restaurant → Vote
- **One-to-Many**: Restaurant → VisitHistory
- **Many-to-Many**: Restaurant ↔ RestaurantCategory (via RestaurantCategoryLink)

## CRUD Operations

### Create
- **Endpoint**: POST /api/v1/restaurants (internal, via Google Places sync)
- **Required Fields**: googlePlaceId, name, latitude, longitude
- **Validation Rules**: 
  - Google Place ID must be unique
  - Location coordinates must be valid
  - Name cannot be empty
- **Permissions**: System/internal only (created via Google Places API sync)

### Read
- **List Endpoint**: GET /api/v1/restaurants/search (with filters)
- **Detail Endpoint**: GET /api/v1/restaurants/:id
- **Filtering**: 
  - Location (radius/distance)
  - Food types
  - Establishment type
  - Price level
  - Dietary requirements (via categories)
  - Recent visits exclusion
- **Sorting**: Distance, rating, visit count, name
- **Pagination**: Page-based (20 per page default)
- **Permissions**: Public read access

### Update
- **Endpoint**: PATCH /api/v1/restaurants/:id (internal) or POST /api/v1/restaurants/:id/refresh
- **Updatable Fields**: All fields except id and googlePlaceId
- **Validation Rules**: 
  - Rating: 0.00-5.00
  - Price level: 1-4
  - Location coordinates: valid ranges
- **Permissions**: System/internal (auto-refresh from Google Places)

### Delete
- **Endpoint**: DELETE /api/v1/restaurants/:id (admin only, future)
- **Delete Strategy**: Hard delete (restaurants can be re-fetched from Google Places)
- **Cascade Rules**: 
  - Votes: Keep votes but remove restaurant reference
  - Visit History: Retain for analytics
- **Permissions**: Admin only

## Business Rules
- **Validation**: 
  - Google Place ID uniqueness enforced
  - Location must be valid PostGIS point
  - Rating must be 0.00-5.00 if provided
- **Constraints**: 
  - Food types array cannot be empty
  - Cached data refreshed every 24 hours
- **Triggers**: 
  - Visit count updated on visit log
  - Last visited updated on visit log

## Indexing Strategy
- **Primary Indexes**: id (primary key), googlePlaceId (unique index)
- **Secondary Indexes**: 
  - location (GIST spatial index for geospatial queries)
  - establishmentType
  - lastVisitedAt
  - visitCount
- **Composite Indexes**: (establishmentType, visitCount) for filtering and sorting

## Sample Data
```json
{
  "id": "rest_abc123",
  "name": "Joe's Pizza",
  "address": "123 Food St, New York, NY 10001",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
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
    "tuesday": "11:00-22:00",
    "wednesday": "11:00-22:00",
    "thursday": "11:00-22:00",
    "friday": "11:00-23:00",
    "saturday": "11:00-23:00",
    "sunday": "12:00-21:00"
  },
  "phoneNumber": "+1234567890",
  "website": "https://joespizza.com",
  "photoUrl": "https://maps.googleapis.com/...",
  "visitCount": 5,
  "lastVisitedAt": "2024-01-15T12:00:00Z",
  "lastCachedAt": "2024-01-20T10:00:00Z"
}
```

