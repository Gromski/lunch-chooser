# API Specifications

## Overview
This document defines all API endpoints for the Lunch Decision Tool, including request/response formats, authentication requirements, error handling, and rate limiting.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## API Versioning
- Current Version: `v1`
- Version specified in URL: `/api/v1/...`
- Future versions will maintain backward compatibility where possible

## Authentication

### Method
- **Primary**: NextAuth.js session-based authentication
- **Alternative**: JWT tokens for API-only access (future)

### Headers
```
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Authentication Endpoints
- Login: `/api/auth/signin` (handled by NextAuth.js)
- Logout: `/api/auth/signout` (handled by NextAuth.js)
- Session: `/api/auth/session` (handled by NextAuth.js)

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional error details
  }
}
```

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_REQUIRED`: User must be authenticated
- `PERMISSION_DENIED`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `DUPLICATE_RESOURCE`: Resource already exists
- `EXTERNAL_API_ERROR`: Error from external API (Google Places)
- `DATABASE_ERROR`: Database operation failed

## Rate Limiting

### Limits
- **General API**: 100 requests per minute per IP
- **Google Places API**: 10 requests per minute per user (to manage costs)
- **Authentication**: 5 login attempts per 15 minutes per IP

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## API Endpoints

### User Endpoints

#### Register User
**POST** `/api/v1/users/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

**Errors:**
- `400`: Invalid email or password format
- `409`: Email already registered

---

#### Get Current User
**GET** `/api/v1/users/me`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "defaultLocation": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "123 Main St, New York, NY"
    },
    "dietaryRequirements": [
      {"id": "diet_veg", "name": "vegetarian"}
    ],
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

---

#### Update User Profile
**PATCH** `/api/v1/users/me`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "defaultLocation": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "456 New St, New York, NY"
  }
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Updated",
    "defaultLocation": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "456 New St, New York, NY"
    },
    "updatedAt": "2024-01-20T11:00:00Z"
  }
}
```

---

#### Update Dietary Requirements
**PUT** `/api/v1/users/me/dietary-requirements`

**Authentication:** Required

**Request Body:**
```json
{
  "dietaryRequirementIds": ["diet_veg", "diet_gf"]
}
```

**Response (200 OK):**
```json
{
  "dietaryRequirements": [
    {"id": "diet_veg", "name": "vegetarian"},
    {"id": "diet_gf", "name": "gluten-free"}
  ]
}
```

---

### Restaurant Endpoints

#### Search Nearby Restaurants
**GET** `/api/v1/restaurants/search`

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

#### Get Restaurant Details
**GET** `/api/v1/restaurants/:id`

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
      "tuesday": "11:00-22:00",
      // ... other days
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

#### Refresh Restaurant Data
**POST** `/api/v1/restaurants/:id/refresh`

**Authentication:** Required (admin or system)

**Description:** Force refresh restaurant data from Google Places API

**Response (200 OK):**
```json
{
  "restaurant": {
    // Updated restaurant data
  },
  "cachedAt": "2024-01-20T12:00:00Z"
}
```

---

### Lunch Group Endpoints

#### Create Lunch Group
**POST** `/api/v1/lunch-groups`

**Authentication:** Required

**Request Body:**
```json
{
  "date": "2024-01-20",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "participantIds": ["user_123", "user_456"] // Optional
}
```

**Response (201 Created):**
```json
{
  "lunchGroup": {
    "id": "group_xyz789",
    "date": "2024-01-20",
    "status": "planning",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "123 Main St, New York, NY"
    },
    "participants": [
      {
        "id": "user_123",
        "name": "John Doe",
        "dietaryRequirements": ["vegetarian"]
      }
    ],
    "aggregatedDietaryRequirements": ["vegetarian"],
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

**Errors:**
- `400`: Invalid date or location
- `422`: Validation errors

---

#### Get Lunch Group
**GET** `/api/v1/lunch-groups/:id`

**Authentication:** Required (must be participant)

**Response (200 OK):**
```json
{
  "lunchGroup": {
    "id": "group_xyz789",
    "date": "2024-01-20",
    "status": "voting",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "123 Main St, New York, NY"
    },
    "participants": [
      {
        "id": "user_123",
        "name": "John Doe",
        "dietaryRequirements": ["vegetarian"]
      }
    ],
    "aggregatedDietaryRequirements": ["vegetarian"],
    "votes": [
      {
        "restaurantId": "rest_abc123",
        "restaurantName": "Joe's Pizza",
        "voteCount": 3,
        "voters": ["user_123", "user_456", "user_789"]
      }
    ],
    "selectedRestaurant": null,
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

**Errors:**
- `403`: Not a participant
- `404`: Group not found

---

#### Get Active Lunch Groups
**GET** `/api/v1/lunch-groups`

**Query Parameters:**
- `date` (optional): Filter by date (default: today)
- `status` (optional): Filter by status
- `userId` (optional): Filter by participant

**Response (200 OK):**
```json
{
  "lunchGroups": [
    {
      "id": "group_xyz789",
      "date": "2024-01-20",
      "status": "voting",
      "participantCount": 3,
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

#### Update Lunch Group
**PATCH** `/api/v1/lunch-groups/:id`

**Authentication:** Required (must be creator or participant)

**Request Body:**
```json
{
  "status": "voting" // planning, voting, decided, completed
}
```

**Response (200 OK):**
```json
{
  "lunchGroup": {
    // Updated lunch group
  }
}
```

**Errors:**
- `403`: Not authorized to update
- `422`: Invalid status transition

---

#### Add Participant to Lunch Group
**POST** `/api/v1/lunch-groups/:id/participants`

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user_456"
}
```

**Response (200 OK):**
```json
{
  "participant": {
    "id": "user_456",
    "name": "Jane Doe",
    "dietaryRequirements": ["vegan"],
    "joinedAt": "2024-01-20T11:00:00Z"
  },
  "lunchGroup": {
    // Updated lunch group with new aggregated requirements
  }
}
```

---

#### Remove Participant from Lunch Group
**DELETE** `/api/v1/lunch-groups/:id/participants/:userId`

**Authentication:** Required (must be participant or creator)

**Response (200 OK):**
```json
{
  "message": "Participant removed",
  "lunchGroup": {
    // Updated lunch group
  }
}
```

---

#### Get Suggested Restaurants for Group
**GET** `/api/v1/lunch-groups/:id/restaurants`

**Authentication:** Required (must be participant)

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `foodTypes` (optional): Additional food type filters
- `establishmentType` (optional): Additional establishment type filter

**Response (200 OK):**
```json
{
  "restaurants": [
    {
      "id": "rest_abc123",
      "name": "Joe's Pizza",
      "distance": 500,
      "walkTime": 6,
      "rating": 4.5,
      "priceLevel": 2,
      "matchesDietaryRequirements": true,
      "recentlyVisited": false,
      "rank": 1
    }
  ],
  "filters": {
    "dietaryRequirements": ["vegetarian"],
    "excludedRecentDays": 1
  }
}
```

---

### Vote Endpoints

#### Cast Vote
**POST** `/api/v1/lunch-groups/:id/votes`

**Authentication:** Required (must be participant)

**Request Body:**
```json
{
  "restaurantId": "rest_abc123"
}
```

**Response (201 Created):**
```json
{
  "vote": {
    "id": "vote_456",
    "restaurantId": "rest_abc123",
    "restaurantName": "Joe's Pizza",
    "userId": "user_123",
    "createdAt": "2024-01-20T12:00:00Z"
  }
}
```

**Errors:**
- `400`: Already voted for this restaurant
- `403`: Not a participant
- `404`: Restaurant not found

---

#### Remove Vote
**DELETE** `/api/v1/lunch-groups/:id/votes/:restaurantId`

**Authentication:** Required (must be participant)

**Response (200 OK):**
```json
{
  "message": "Vote removed"
}
```

---

#### Get Votes for Lunch Group
**GET** `/api/v1/lunch-groups/:id/votes`

**Authentication:** Required (must be participant)

**Response (200 OK):**
```json
{
  "votes": [
    {
      "restaurantId": "rest_abc123",
      "restaurantName": "Joe's Pizza",
      "voteCount": 3,
      "voters": [
        {"id": "user_123", "name": "John Doe"},
        {"id": "user_456", "name": "Jane Doe"},
        {"id": "user_789", "name": "Bob Smith"}
      ]
    }
  ]
}
```

---

### Visit History Endpoints

#### Log Visit
**POST** `/api/v1/lunch-groups/:id/visits`

**Authentication:** Required (must be participant)

**Request Body:**
```json
{
  "restaurantId": "rest_abc123",
  "visitedAt": "2024-01-20",
  "notes": "Great pizza!"
}
```

**Response (201 Created):**
```json
{
  "visit": {
    "id": "visit_789",
    "restaurantId": "rest_abc123",
    "restaurantName": "Joe's Pizza",
    "visitedAt": "2024-01-20",
    "notes": "Great pizza!",
    "createdAt": "2024-01-20T14:00:00Z"
  }
}
```

**Errors:**
- `400`: Invalid date or restaurant
- `403`: Not a participant
- `422`: Group not completed

---

#### Get Visit History
**GET** `/api/v1/restaurants/:id/visits`

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 30)
- `groupId` (optional): Filter by lunch group

**Response (200 OK):**
```json
{
  "visits": [
    {
      "id": "visit_789",
      "lunchGroupId": "group_xyz789",
      "visitedAt": "2024-01-20",
      "notes": "Great pizza!"
    }
  ]
}
```

---

### Reference Data Endpoints

#### Get Dietary Requirements
**GET** `/api/v1/dietary-requirements`

**Response (200 OK):**
```json
{
  "dietaryRequirements": [
    {"id": "diet_veg", "name": "vegetarian", "description": "No meat or fish"},
    {"id": "diet_vegan", "name": "vegan", "description": "No animal products"}
  ]
}
```

---

#### Get Restaurant Categories
**GET** `/api/v1/restaurant-categories`

**Response (200 OK):**
```json
{
  "categories": [
    {"id": "cat_italian", "name": "Italian", "slug": "italian"},
    {"id": "cat_asian", "name": "Asian", "slug": "asian"}
  ]
}
```

---

## WebSocket Events (Future - Phase 2+)

### Connection
- **Endpoint**: `wss://your-domain.com/api/v1/ws`
- **Authentication**: JWT token in connection header

### Events

#### `lunch-group:updated`
Emitted when lunch group is updated (new participant, status change, etc.)

```json
{
  "event": "lunch-group:updated",
  "data": {
    "lunchGroupId": "group_xyz789",
    "changes": {
      "status": "voting"
    }
  }
}
```

#### `vote:cast`
Emitted when a vote is cast

```json
{
  "event": "vote:cast",
  "data": {
    "lunchGroupId": "group_xyz789",
    "restaurantId": "rest_abc123",
    "voteCount": 3
  }
}
```

## Security Considerations

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention via Prisma parameterized queries
- XSS prevention via input sanitization
- Rate limiting on all endpoints

### API Key Management
- Google Places API key stored in environment variables
- Never exposed to client-side code
- Server-side proxy for all Google Places API calls

### CORS
- Configured for specific allowed origins
- Credentials included for authenticated requests

### Data Privacy
- User data encrypted at rest
- PII handled according to privacy regulations
- GDPR compliance for EU users (future)

