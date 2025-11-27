# Visit History Entity

## Overview
The VisitHistory entity tracks historical visits to restaurants by lunch groups, used for smart ranking and exclusion logic.

## Database Schema
```sql
CREATE TABLE "VisitHistory" (
  id TEXT PRIMARY KEY,
  lunchGroupId TEXT NOT NULL REFERENCES "LunchGroup"(id) ON DELETE CASCADE,
  restaurantId TEXT NOT NULL REFERENCES "Restaurant"(id) ON DELETE CASCADE,
  visitedAt DATE NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships
- **Many-to-One**: VisitHistory → LunchGroup
- **Many-to-One**: VisitHistory → Restaurant

## CRUD Operations

### Create
- **Endpoint**: POST /api/v1/lunch-groups/:id/visits
- **Required Fields**: restaurantId, visitedAt
- **Validation Rules**: 
  - Lunch group must be completed
  - Visited date cannot be in the future
  - Restaurant must exist
  - Cannot log duplicate visits (same group, same restaurant, same date)
- **Permissions**: Must be participant in lunch group

### Read
- **List Endpoint**: GET /api/v1/restaurants/:id/visits
- **Detail Endpoint**: Not applicable
- **Filtering**: 
  - By restaurant (required)
  - By lunch group
  - By date range (days parameter)
- **Sorting**: VisitedAt (descending)
- **Pagination**: Not applicable (typically small result sets)
- **Permissions**: Public read (visit history is not sensitive)

### Update
- **Endpoint**: PATCH /api/v1/visits/:id (future, admin only)
- **Updatable Fields**: notes
- **Validation Rules**: Notes length limit (500 characters)
- **Permissions**: Admin only (visits are typically immutable)

### Delete
- **Endpoint**: DELETE /api/v1/visits/:id (admin only, future)
- **Delete Strategy**: Hard delete
- **Cascade Rules**: None (cascades from group/restaurant deletion)
- **Permissions**: Admin only

## Business Rules
- **Validation**: 
  - Visited date must be valid date
  - Cannot log future visits
  - Group must be in 'completed' status
- **Constraints**: 
  - One visit record per group per restaurant per date
  - Visit date typically matches group date
- **Triggers**: 
  - Updates Restaurant.visitCount
  - Updates Restaurant.lastVisitedAt

## Indexing Strategy
- **Primary Indexes**: id (primary key)
- **Secondary Indexes**: 
  - lunchGroupId
  - restaurantId
  - visitedAt
- **Composite Indexes**: 
  - (restaurantId, visitedAt) for recent visit queries
  - (lunchGroupId, restaurantId, visitedAt) for duplicate prevention

## Sample Data
```json
{
  "id": "visit_789",
  "lunchGroupId": "group_xyz789",
  "restaurantId": "rest_abc123",
  "restaurantName": "Joe's Pizza",
  "visitedAt": "2024-01-20",
  "notes": "Great pizza, will come back",
  "createdAt": "2024-01-20T14:00:00Z"
}
```

## Usage in Business Logic
- **Recent Visit Exclusion**: Restaurants visited yesterday are excluded
- **Recent Visit Flagging**: Restaurants visited in last 7-14 days are flagged
- **Frequency Ranking**: Restaurants with higher visit counts are boosted
- **Smart Suggestions**: Avoid suggesting recently visited restaurants

