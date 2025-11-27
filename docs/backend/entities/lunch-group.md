# Lunch Group Entity

## Overview
The LunchGroup entity represents a lunch planning session for a specific date with participants, status, and selected restaurant.

## Database Schema
```sql
CREATE TABLE "LunchGroup" (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  locationLat DECIMAL(10, 8) NOT NULL,
  locationLng DECIMAL(11, 8) NOT NULL,
  locationAddress TEXT,
  aggregatedDietaryRequirements TEXT[],
  selectedRestaurantId TEXT REFERENCES "Restaurant"(id),
  createdById TEXT NOT NULL REFERENCES "User"(id),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships
- **Many-to-One**: LunchGroup → User (creator via createdById)
- **Many-to-Many**: LunchGroup ↔ User (participants via LunchGroupParticipant)
- **One-to-Many**: LunchGroup → Vote
- **One-to-Many**: LunchGroup → VisitHistory
- **Many-to-One**: LunchGroup → Restaurant (selectedRestaurantId)

## CRUD Operations

### Create
- **Endpoint**: POST /api/v1/lunch-groups
- **Required Fields**: date, locationLat, locationLng
- **Validation Rules**: 
  - Date cannot be in the past (except today)
  - Location coordinates must be valid
  - Creator automatically added as participant
- **Permissions**: Authenticated users only

### Read
- **List Endpoint**: GET /api/v1/lunch-groups (with filters)
- **Detail Endpoint**: GET /api/v1/lunch-groups/:id
- **Filtering**: 
  - Date (default: today)
  - Status
  - Participant (userId)
- **Sorting**: Date (descending), createdAt
- **Pagination**: Page-based (20 per page)
- **Permissions**: Must be participant to view details

### Update
- **Endpoint**: PATCH /api/v1/lunch-groups/:id
- **Updatable Fields**: status, selectedRestaurantId, locationLat, locationLng, locationAddress
- **Validation Rules**: 
  - Status transitions: planning → voting → decided → completed
  - Cannot move backwards in status (except decided → voting)
  - Selected restaurant must exist
- **Permissions**: Creator or participant (limited fields)

### Delete
- **Endpoint**: DELETE /api/v1/lunch-groups/:id
- **Delete Strategy**: Hard delete (cascade to participants, votes, visits)
- **Cascade Rules**: 
  - Participants: Deleted
  - Votes: Deleted
  - Visit History: Retained for analytics (soft link)
- **Permissions**: Creator only

## Business Rules
- **Validation**: 
  - Status must be one of: planning, voting, decided, completed
  - Date validation (cannot create for past dates)
  - Aggregated dietary requirements computed from participants
- **Constraints**: 
  - Cannot have duplicate participants
  - Cannot vote when status is not 'voting' or 'planning'
- **Triggers**: 
  - UpdatedAt timestamp auto-updated
  - Aggregated dietary requirements recalculated on participant change

## Indexing Strategy
- **Primary Indexes**: id (primary key)
- **Secondary Indexes**: 
  - date
  - status
  - createdById
  - selectedRestaurantId
- **Composite Indexes**: (date, status) for active group queries

## Sample Data
```json
{
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
    },
    {
      "id": "user_456",
      "name": "Jane Doe",
      "dietaryRequirements": ["vegan", "gluten-free"]
    }
  ],
  "aggregatedDietaryRequirements": ["vegetarian", "vegan", "gluten-free"],
  "selectedRestaurantId": null,
  "votes": [
    {
      "restaurantId": "rest_abc123",
      "voteCount": 2
    }
  ],
  "createdById": "user_123",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T12:00:00Z"
}
```

