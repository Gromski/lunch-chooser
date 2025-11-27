# User API Endpoints

## Overview
This document details all API endpoints related to user management, authentication, and profile operations.

## Base Path
`/api/v1/users`

## Endpoints

### Register User
**POST** `/api/v1/users/register`

**Description**: Create a new user account

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

### Get Current User
**GET** `/api/v1/users/me`

**Description**: Get the authenticated user's profile

**Authentication**: Required

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

**Errors:**
- `401`: Not authenticated

---

### Update User Profile
**PATCH** `/api/v1/users/me`

**Description**: Update the authenticated user's profile

**Authentication**: Required

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

**Errors:**
- `400`: Invalid data
- `401`: Not authenticated
- `422`: Validation errors

---

### Update Dietary Requirements
**PUT** `/api/v1/users/me/dietary-requirements`

**Description**: Update user's dietary requirements

**Authentication**: Required

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

**Errors:**
- `400`: Invalid dietary requirement IDs
- `401`: Not authenticated
- `422`: Validation errors

---

## Implementation Notes

### Authentication
- Uses NextAuth.js session-based authentication
- Session token in HTTP-only cookie
- JWT tokens for API access (future)

### Validation
- Email format validation
- Password strength requirements (8+ characters)
- Name length validation (1-100 characters)
- Location coordinate validation

### Security
- Password hashing with bcrypt
- Input sanitization
- Rate limiting on registration endpoint
- Email verification (optional, future)

