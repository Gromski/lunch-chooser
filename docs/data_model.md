# Data Model Documentation

## Overview
This document defines the complete database schema for the Lunch Decision Tool, including all entities, relationships, validation rules, and indexing strategies.

## Database Technology
- **Primary Database**: PostgreSQL 15+
- **Geospatial Extension**: PostGIS 3.3+
- **ORM**: Prisma
- **Migration Tool**: Prisma Migrate

## Entity Definitions

### User Entity

#### Purpose
Stores user account information, authentication data, dietary requirements, and preferences.

#### Database Schema
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified TIMESTAMP,
  name TEXT,
  passwordHash TEXT, -- Only if using email/password auth
  image TEXT, -- Profile picture URL
  defaultLocationLat DECIMAL(10, 8),
  defaultLocationLng DECIMAL(11, 8),
  defaultLocationAddress TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "User_email_idx" ON "User"(email);
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
```

#### Relationships
- One-to-Many: User → LunchGroup (as creator/participant via junction table)
- Many-to-Many: User ↔ DietaryRequirement
- One-to-Many: User → Vote

#### Validation Rules
- Email must be valid format and unique
- Password must be at least 8 characters (if using password auth)
- Location coordinates must be valid (lat: -90 to 90, lng: -180 to 180)
- Name must be between 1 and 100 characters

#### Sample Data
```json
{
  "id": "user_123",
  "email": "john@example.com",
  "name": "John Doe",
  "defaultLocationLat": 40.7128,
  "defaultLocationLng": -74.0060,
  "defaultLocationAddress": "123 Main St, New York, NY"
}
```

---

### DietaryRequirement Entity

#### Purpose
Enum-like table for standard dietary requirements that can be applied to users and used for filtering.

#### Database Schema
```sql
CREATE TABLE "DietaryRequirement" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- e.g., "vegetarian", "vegan", "gluten-free"
  description TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populated values:
-- vegetarian, vegan, gluten-free, dairy-free, nut-free, halal, kosher, pescatarian
```

#### Relationships
- Many-to-Many: DietaryRequirement ↔ User (via UserDietaryRequirement)

#### Sample Data
```json
{
  "id": "diet_veg",
  "name": "vegetarian",
  "description": "No meat or fish"
}
```

---

### UserDietaryRequirement (Junction Table)

#### Purpose
Links users to their dietary requirements.

#### Database Schema
```sql
CREATE TABLE "UserDietaryRequirement" (
  userId TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  dietaryRequirementId TEXT NOT NULL REFERENCES "DietaryRequirement"(id) ON DELETE CASCADE,
  PRIMARY KEY (userId, dietaryRequirementId)
);

CREATE INDEX "UserDietaryRequirement_userId_idx" ON "UserDietaryRequirement"("userId");
```

---

### Restaurant Entity

#### Purpose
Caches restaurant data from Google Places API with additional metadata for filtering and ranking.

#### Database Schema
```sql
CREATE TABLE "Restaurant" (
  id TEXT PRIMARY KEY, -- Google Places ID
  name TEXT NOT NULL,
  address TEXT,
  location POINT NOT NULL, -- PostGIS geometry type for geospatial queries
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  googlePlaceId TEXT UNIQUE NOT NULL,
  foodTypes TEXT[], -- Array of food categories
  establishmentType TEXT, -- sit-down, takeaway, café
  priceLevel INTEGER, -- 1-4 ($ to $$$$)
  rating DECIMAL(3, 2), -- 0.00 to 5.00
  userRatingsTotal INTEGER,
  openingHours JSONB, -- Cached opening hours
  phoneNumber TEXT,
  website TEXT,
  photoUrl TEXT,
  lastCachedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visitCount INTEGER DEFAULT 0, -- Number of times visited by groups
  lastVisitedAt TIMESTAMP, -- Last visit date by any group
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PostGIS spatial index for location queries
CREATE INDEX "Restaurant_location_idx" ON "Restaurant" USING GIST(location);
CREATE INDEX "Restaurant_googlePlaceId_idx" ON "Restaurant"("googlePlaceId");
CREATE INDEX "Restaurant_establishmentType_idx" ON "Restaurant"("establishmentType");
CREATE INDEX "Restaurant_lastVisitedAt_idx" ON "Restaurant"("lastVisitedAt");
CREATE INDEX "Restaurant_visitCount_idx" ON "Restaurant"("visitCount");
```

#### Relationships
- One-to-Many: Restaurant → Vote
- One-to-Many: Restaurant → VisitHistory
- Many-to-Many: Restaurant ↔ RestaurantCategory (via RestaurantCategoryLink)

#### Validation Rules
- Google Place ID must be unique
- Location coordinates must be valid
- Rating must be between 0.00 and 5.00
- Price level must be between 1 and 4
- Food types array cannot be empty

#### Geospatial Queries
```sql
-- Find restaurants within radius (using PostGIS)
SELECT *, ST_Distance(location, ST_MakePoint(?, ?)::geography) as distance
FROM "Restaurant"
WHERE ST_DWithin(location, ST_MakePoint(?, ?)::geography, ?)
ORDER BY distance;
```

#### Sample Data
```json
{
  "id": "rest_abc123",
  "name": "Joe's Pizza",
  "address": "123 Food St, New York, NY",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "foodTypes": ["pizza", "italian"],
  "establishmentType": "sit-down",
  "priceLevel": 2,
  "rating": 4.5,
  "userRatingsTotal": 1250,
  "visitCount": 5,
  "lastVisitedAt": "2024-01-15T12:00:00Z"
}
```

---

### RestaurantCategory Entity

#### Purpose
Defines food type categories for filtering (Italian, Asian, sandwiches, etc.).

#### Database Schema
```sql
CREATE TABLE "RestaurantCategory" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships
- Many-to-Many: RestaurantCategory ↔ Restaurant (via RestaurantCategoryLink)

---

### RestaurantCategoryLink (Junction Table)

#### Purpose
Links restaurants to multiple food categories.

#### Database Schema
```sql
CREATE TABLE "RestaurantCategoryLink" (
  restaurantId TEXT NOT NULL REFERENCES "Restaurant"(id) ON DELETE CASCADE,
  categoryId TEXT NOT NULL REFERENCES "RestaurantCategory"(id) ON DELETE CASCADE,
  PRIMARY KEY (restaurantId, categoryId)
);

CREATE INDEX "RestaurantCategoryLink_restaurantId_idx" ON "RestaurantCategoryLink"("restaurantId");
CREATE INDEX "RestaurantCategoryLink_categoryId_idx" ON "RestaurantCategoryLink"("categoryId");
```

---

### LunchGroup Entity

#### Purpose
Represents a lunch planning session for a specific date with participants and status.

#### Database Schema
```sql
CREATE TABLE "LunchGroup" (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning', -- planning, voting, decided, completed
  locationLat DECIMAL(10, 8) NOT NULL,
  locationLng DECIMAL(11, 8) NOT NULL,
  locationAddress TEXT,
  aggregatedDietaryRequirements TEXT[], -- Array of requirement IDs
  selectedRestaurantId TEXT REFERENCES "Restaurant"(id),
  createdById TEXT NOT NULL REFERENCES "User"(id),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "LunchGroup_date_idx" ON "LunchGroup"(date);
CREATE INDEX "LunchGroup_status_idx" ON "LunchGroup"(status);
CREATE INDEX "LunchGroup_createdById_idx" ON "LunchGroup"("createdById");
CREATE INDEX "LunchGroup_selectedRestaurantId_idx" ON "LunchGroup"("selectedRestaurantId");
```

#### Relationships
- Many-to-Many: LunchGroup ↔ User (via LunchGroupParticipant)
- One-to-Many: LunchGroup → Vote
- One-to-Many: LunchGroup → VisitHistory
- Many-to-One: LunchGroup → Restaurant (selectedRestaurantId)

#### Validation Rules
- Date cannot be in the past (except for today)
- Status must be one of: planning, voting, decided, completed
- Location coordinates must be valid
- Aggregated dietary requirements array is computed from participants

#### Sample Data
```json
{
  "id": "group_xyz789",
  "date": "2024-01-20",
  "status": "voting",
  "locationLat": 40.7128,
  "locationLng": -74.0060,
  "locationAddress": "123 Main St, New York, NY",
  "aggregatedDietaryRequirements": ["vegetarian", "gluten-free"],
  "createdById": "user_123"
}
```

---

### LunchGroupParticipant (Junction Table)

#### Purpose
Links users to lunch groups they're participating in.

#### Database Schema
```sql
CREATE TABLE "LunchGroupParticipant" (
  lunchGroupId TEXT NOT NULL REFERENCES "LunchGroup"(id) ON DELETE CASCADE,
  userId TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  joinedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (lunchGroupId, userId)
);

CREATE INDEX "LunchGroupParticipant_lunchGroupId_idx" ON "LunchGroupParticipant"("lunchGroupId");
CREATE INDEX "LunchGroupParticipant_userId_idx" ON "LunchGroupParticipant"("userId");
```

---

### Vote Entity

#### Purpose
Stores votes cast by users for restaurants in lunch groups.

#### Database Schema
```sql
CREATE TABLE "Vote" (
  id TEXT PRIMARY KEY,
  lunchGroupId TEXT NOT NULL REFERENCES "LunchGroup"(id) ON DELETE CASCADE,
  userId TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  restaurantId TEXT NOT NULL REFERENCES "Restaurant"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lunchGroupId, userId, restaurantId) -- One vote per user per restaurant per group
);

CREATE INDEX "Vote_lunchGroupId_idx" ON "Vote"("lunchGroupId");
CREATE INDEX "Vote_restaurantId_idx" ON "Vote"("restaurantId");
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");
```

#### Relationships
- Many-to-One: Vote → LunchGroup
- Many-to-One: Vote → User
- Many-to-One: Vote → Restaurant

#### Validation Rules
- User can only vote once per restaurant per lunch group
- User must be a participant in the lunch group
- Vote can only be cast when group status is 'voting' or 'planning'

#### Sample Data
```json
{
  "id": "vote_456",
  "lunchGroupId": "group_xyz789",
  "userId": "user_123",
  "restaurantId": "rest_abc123",
  "createdAt": "2024-01-20T12:30:00Z"
}
```

---

### VisitHistory Entity

#### Purpose
Tracks historical visits to restaurants by lunch groups for smart ranking and exclusion logic.

#### Database Schema
```sql
CREATE TABLE "VisitHistory" (
  id TEXT PRIMARY KEY,
  lunchGroupId TEXT NOT NULL REFERENCES "LunchGroup"(id) ON DELETE CASCADE,
  restaurantId TEXT NOT NULL REFERENCES "Restaurant"(id) ON DELETE CASCADE,
  visitedAt DATE NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "VisitHistory_lunchGroupId_idx" ON "VisitHistory"("lunchGroupId");
CREATE INDEX "VisitHistory_restaurantId_idx" ON "VisitHistory"("restaurantId");
CREATE INDEX "VisitHistory_visitedAt_idx" ON "VisitHistory"("visitedAt");
CREATE INDEX "VisitHistory_restaurant_visitedAt_idx" ON "VisitHistory"("restaurantId", "visitedAt");
```

#### Relationships
- Many-to-One: VisitHistory → LunchGroup
- Many-to-One: VisitHistory → Restaurant

#### Validation Rules
- Visited date cannot be in the future
- Visit can only be logged for completed lunch groups

#### Sample Data
```json
{
  "id": "visit_789",
  "lunchGroupId": "group_xyz789",
  "restaurantId": "rest_abc123",
  "visitedAt": "2024-01-20",
  "notes": "Great pizza, will come back"
}
```

---

## Entity Relationship Diagram

```
User
  ├── UserDietaryRequirement ── DietaryRequirement
  ├── LunchGroupParticipant ── LunchGroup
  │                              ├── Vote ── Restaurant
  │                              └── VisitHistory ── Restaurant
  └── Vote ── Restaurant
                └── RestaurantCategoryLink ── RestaurantCategory
```

## Indexing Strategy

### Primary Indexes
- All primary keys (id columns)
- Foreign key columns for join performance
- Unique constraint columns (email, googlePlaceId)

### Secondary Indexes
- Date columns for time-based queries (LunchGroup.date, VisitHistory.visitedAt)
- Status columns for filtering (LunchGroup.status)
- Location columns for geospatial queries (Restaurant.location - GIST index)

### Composite Indexes
- (restaurantId, visitedAt) on VisitHistory for recent visit queries
- (lunchGroupId, userId, restaurantId) on Vote for vote lookups
- (userId, createdAt) on User for user activity queries

## Data Validation Rules

### Global Rules
- All timestamps use UTC timezone
- All IDs use UUID v4 or nanoid format
- Soft deletes preferred over hard deletes where applicable
- CreatedAt and UpdatedAt timestamps auto-managed

### Business Rules
1. **Restaurant Caching**: Restaurants are cached for 24 hours, then refreshed from Google Places API
2. **Visit Exclusion**: Restaurants visited yesterday are automatically excluded from suggestions
3. **Recent Visit Flagging**: Restaurants visited in last 7-14 days are flagged but not excluded
4. **Dietary Aggregation**: Group dietary requirements are union of all participant requirements
5. **Vote Uniqueness**: One vote per user per restaurant per group
6. **Group Status Flow**: planning → voting → decided → completed

## Migration Strategy

### Initial Migration
1. Create all base tables
2. Create all indexes
3. Insert seed data (DietaryRequirement, RestaurantCategory)
4. Enable PostGIS extension

### Future Migrations
- Add new fields with default values
- Create new tables for Phase 2/3 features
- Add indexes for new query patterns
- Migrate data when schema changes

## Sample Data Structures

### Complete User with Relationships
```json
{
  "id": "user_123",
  "email": "john@example.com",
  "name": "John Doe",
  "defaultLocation": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "dietaryRequirements": [
    {"id": "diet_veg", "name": "vegetarian"},
    {"id": "diet_gf", "name": "gluten-free"}
  ]
}
```

### Complete Lunch Group with Relationships
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
      "dietaryRequirements": ["vegetarian", "gluten-free"]
    }
  ],
  "aggregatedDietaryRequirements": ["vegetarian", "gluten-free"],
  "votes": [
    {
      "restaurantId": "rest_abc123",
      "restaurantName": "Joe's Pizza",
      "voteCount": 3
    }
  ]
}
```

### Complete Restaurant with Relationships
```json
{
  "id": "rest_abc123",
  "name": "Joe's Pizza",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Food St, New York, NY"
  },
  "foodTypes": ["pizza", "italian"],
  "categories": [
    {"id": "cat_italian", "name": "Italian"}
  ],
  "establishmentType": "sit-down",
  "priceLevel": 2,
  "rating": 4.5,
  "distance": 0.5,
  "walkTime": 6,
  "visitCount": 5,
  "lastVisitedAt": "2024-01-15",
  "recentlyVisited": false
}
```

## Performance Considerations

### Query Optimization
- Use PostGIS spatial indexes for location queries
- Implement pagination for restaurant lists
- Cache frequently accessed data (restaurant details, user profiles)
- Use database connection pooling

### Data Retention
- VisitHistory: Retain indefinitely for analytics
- Old LunchGroups: Archive after 90 days, delete after 1 year
- Cached Restaurants: Refresh every 24 hours, remove if not accessed in 30 days

### Scalability
- Consider read replicas for high-traffic queries
- Implement Redis caching for hot data
- Partition large tables by date if needed (future)

