# Lunch Group API Endpoints

## Overview
This document details all API endpoints related to lunch group management, participants, and restaurant suggestions.

## Base Path
`/api/v1/lunch-groups`

## Endpoints

### Create Lunch Group
**POST** `/api/v1/lunch-groups`

**Description**: Create a new lunch group for a specific date

**Authentication**: Required

**Request Body:**
```json
{
  "date": "2024-01-20",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "participantIds": ["user_123", "user_456"]
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
- `401`: Not authenticated
- `422`: Validation errors

---

### Get Lunch Group
**GET** `/api/v1/lunch-groups/:id`

**Description**: Get detailed information about a lunch group

**Authentication**: Required (must be participant)

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
- `401`: Not authenticated
- `403`: Not a participant
- `404`: Group not found

---

### Get Active Lunch Groups
**GET** `/api/v1/lunch-groups`

**Description**: Get list of active lunch groups

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

### Update Lunch Group
**PATCH** `/api/v1/lunch-groups/:id`

**Description**: Update lunch group (status, selected restaurant, etc.)

**Authentication**: Required (creator or participant)

**Request Body:**
```json
{
  "status": "voting"
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
- `400`: Invalid status transition
- `401`: Not authenticated
- `403`: Not authorized
- `422`: Validation errors

---

### Add Participant
**POST** `/api/v1/lunch-groups/:id/participants`

**Description**: Add a user to the lunch group

**Authentication**: Required

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

**Errors:**
- `400`: User already participant
- `401`: Not authenticated
- `404`: User or group not found

---

### Remove Participant
**DELETE** `/api/v1/lunch-groups/:id/participants/:userId`

**Description**: Remove a user from the lunch group

**Authentication**: Required (participant or creator)

**Response (200 OK):**
```json
{
  "message": "Participant removed",
  "lunchGroup": {
    // Updated lunch group
  }
}
```

**Errors:**
- `401`: Not authenticated
- `403`: Not authorized
- `404`: Participant not found

---

### Get Suggested Restaurants
**GET** `/api/v1/lunch-groups/:id/restaurants`

**Description**: Get filtered restaurant suggestions for the lunch group

**Authentication**: Required (must be participant)

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

**Errors:**
- `401`: Not authenticated
- `403`: Not a participant
- `404`: Group not found

---

## Implementation Notes

### Dietary Requirements Aggregation
- Automatically computed from all participants
- Union of all participant requirements
- Updated when participants added/removed

### Status Transitions
- `planning` → `voting`: Start voting phase
- `voting` → `decided`: Restaurant selected
- `decided` → `completed`: Visit logged
- Cannot move backwards (except `decided` → `voting`)

### Restaurant Filtering
- Filters by aggregated dietary requirements
- Excludes recently visited restaurants
- Applies group location
- Smart ranking based on group preferences

