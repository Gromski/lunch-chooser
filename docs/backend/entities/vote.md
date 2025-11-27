# Vote Entity

## Overview
The Vote entity represents a user's vote for a restaurant within a lunch group, used for group decision-making.

## Database Schema
```sql
CREATE TABLE "Vote" (
  id TEXT PRIMARY KEY,
  lunchGroupId TEXT NOT NULL REFERENCES "LunchGroup"(id) ON DELETE CASCADE,
  userId TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  restaurantId TEXT NOT NULL REFERENCES "Restaurant"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lunchGroupId, userId, restaurantId)
);
```

## Relationships
- **Many-to-One**: Vote → LunchGroup
- **Many-to-One**: Vote → User
- **Many-to-One**: Vote → Restaurant

## CRUD Operations

### Create
- **Endpoint**: POST /api/v1/lunch-groups/:id/votes
- **Required Fields**: restaurantId
- **Validation Rules**: 
  - User must be participant in lunch group
  - Group status must be 'voting' or 'planning'
  - Restaurant must exist
  - User can only vote once per restaurant per group
- **Permissions**: Must be participant in lunch group

### Read
- **List Endpoint**: GET /api/v1/lunch-groups/:id/votes
- **Detail Endpoint**: Not applicable (votes are aggregated)
- **Filtering**: 
  - By lunch group (required)
  - By restaurant
  - By user
- **Sorting**: Vote count (descending), createdAt
- **Pagination**: Not applicable (votes are aggregated by restaurant)
- **Permissions**: Must be participant in lunch group

### Update
- **Endpoint**: Not applicable (votes are immutable)
- **Alternative**: Delete and recreate vote

### Delete
- **Endpoint**: DELETE /api/v1/lunch-groups/:id/votes/:restaurantId
- **Delete Strategy**: Hard delete
- **Cascade Rules**: None (cascades from group/user/restaurant deletion)
- **Permissions**: User can only delete own votes

## Business Rules
- **Validation**: 
  - One vote per user per restaurant per group (enforced by unique constraint)
  - User must be participant
  - Group must be in voting or planning status
- **Constraints**: 
  - Cannot vote for restaurants not in suggestions
  - Votes are immutable (delete and recreate to change)
- **Triggers**: None

## Indexing Strategy
- **Primary Indexes**: id (primary key)
- **Secondary Indexes**: 
  - lunchGroupId
  - userId
  - restaurantId
- **Composite Indexes**: 
  - (lunchGroupId, restaurantId) for vote counting
  - (lunchGroupId, userId, restaurantId) unique constraint

## Sample Data
```json
{
  "id": "vote_456",
  "lunchGroupId": "group_xyz789",
  "userId": "user_123",
  "restaurantId": "rest_abc123",
  "restaurantName": "Joe's Pizza",
  "createdAt": "2024-01-20T12:30:00Z"
}
```

## Aggregated Vote Data
Votes are typically returned aggregated by restaurant:
```json
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
```

