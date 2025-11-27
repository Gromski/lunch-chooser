# User Entity

## Overview
The User entity represents a user account in the system, storing authentication information, profile data, dietary requirements, and location preferences.

## Database Schema
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified TIMESTAMP,
  name TEXT,
  passwordHash TEXT,
  image TEXT,
  defaultLocationLat DECIMAL(10, 8),
  defaultLocationLng DECIMAL(11, 8),
  defaultLocationAddress TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships
- **One-to-Many**: User → LunchGroup (as creator via createdById)
- **Many-to-Many**: User ↔ LunchGroup (as participant via LunchGroupParticipant)
- **Many-to-Many**: User ↔ DietaryRequirement (via UserDietaryRequirement)
- **One-to-Many**: User → Vote

## CRUD Operations

### Create
- **Endpoint**: POST /api/v1/users/register
- **Required Fields**: email, password, name (optional)
- **Validation Rules**: 
  - Email must be valid format and unique
  - Password must be at least 8 characters
  - Name must be 1-100 characters if provided
- **Permissions**: Public (registration endpoint)

### Read
- **List Endpoint**: GET /api/v1/users (admin only, future)
- **Detail Endpoint**: GET /api/v1/users/me (current user)
- **Filtering**: Not applicable for public endpoints
- **Sorting**: Not applicable
- **Pagination**: Not applicable for user detail
- **Permissions**: User can only read own profile

### Update
- **Endpoint**: PATCH /api/v1/users/me
- **Updatable Fields**: name, defaultLocationLat, defaultLocationLng, defaultLocationAddress, image
- **Validation Rules**: 
  - Name: 1-100 characters
  - Location coordinates: valid lat/lng ranges
  - Email: cannot be changed (separate endpoint if needed)
- **Permissions**: User can only update own profile

### Delete
- **Endpoint**: DELETE /api/v1/users/me (future)
- **Delete Strategy**: Soft delete (mark as deleted, retain data for 30 days)
- **Cascade Rules**: 
  - Votes: Keep votes but anonymize
  - Lunch Groups: Transfer ownership or cancel
  - Visit History: Retain for analytics
- **Permissions**: User can only delete own account

## Business Rules
- **Validation**: Email uniqueness enforced at database level
- **Constraints**: 
  - Password hash required if using email/password auth
  - Location coordinates must be valid if provided
- **Triggers**: UpdatedAt timestamp auto-updated on changes

## Indexing Strategy
- **Primary Indexes**: id (primary key)
- **Secondary Indexes**: email (unique index)
- **Composite Indexes**: (createdAt) for user activity queries

## Sample Data
```json
{
  "id": "user_123",
  "email": "john@example.com",
  "emailVerified": "2024-01-20T10:00:00Z",
  "name": "John Doe",
  "image": "https://example.com/avatar.jpg",
  "defaultLocation": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "dietaryRequirements": [
    {"id": "diet_veg", "name": "vegetarian"},
    {"id": "diet_gf", "name": "gluten-free"}
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T11:00:00Z"
}
```

