# Implementation Plan for Lunch Decision Tool

## Feature Analysis

### Identified Features:

#### Phase 1: MVP (Must-Have)
1. **Location Detection & Setting**: Detect user's current location via browser geolocation API or allow manual office location setting
2. **Restaurant Discovery**: Pull nearby food options from Google Places API within configurable radius/walk time
3. **Restaurant Display**: Show basic info (name, type, distance, estimated walk time) in ranked list
4. **Food Type Filtering**: Filter by cuisine type (Italian, Asian, sandwiches, etc.)
5. **Establishment Type Filtering**: Filter by type (sit-down, takeaway, café)
6. **Distance/Walk Time Filtering**: Filter by distance or estimated walk time
7. **Mobile-Responsive Interface**: Works seamlessly on desktop and mobile browsers

#### Phase 1: Nice-to-Have
8. **User Accounts**: Simple user authentication and profile management
9. **Dietary Requirements Storage**: Store user dietary requirements (vegetarian, vegan, gluten-free, allergies)
10. **Manual Dietary Entry**: Allow manual entry of dietary requirements without account
11. **Lunch Group Creation**: Create a "lunch group" for today's lunch session
12. **Group Participation**: See who's joining the lunch group
13. **Dietary Aggregation**: Automatically aggregate dietary requirements from all group members
14. **Group-Based Filtering**: Filter restaurant results to match everyone's dietary needs

#### Phase 2: Must-Have
15. **Visit Tracking**: Log where the group ate for historical tracking
16. **Recent Visit Flagging**: Flag restaurants visited in last 7-14 days
17. **Auto-Exclude Yesterday**: Automatically exclude yesterday's choice from suggestions
18. **Smart Ranking**: Boost frequently visited places and surface new options periodically
19. **Group Size Weighting**: Weight restaurant suggestions by group size suitability
20. **Voting System**: Show top 3-5 options with quick vote mechanism
21. **Auto-Select Winner**: Automatically select winner or show voting results

#### Phase 2: Nice-to-Have
22. **Opening Hours Caching**: Cache and display restaurant opening hours
23. **Price Indicators**: Show price level indicators ($, $$, $$$)
24. **Multi-Source Ratings**: Pull and display ratings from multiple sources
25. **Menu Information**: Display basic menu information when available
26. **Temporary Preferences**: "Today I want..." preferences (hot food, light meal, specific cuisine)
27. **Preference Priority**: Distinguish between must-haves vs. nice-to-haves
28. **Weather-Aware Suggestions**: Adjust suggestions based on weather conditions

#### Phase 3: Future Features
29. **Slack Bot Integration**: Create lunch groups via Slack bot
30. **WhatsApp Integration**: Create lunch groups via WhatsApp
31. **Calendar Integration**: Integrate with calendar for timing
32. **Preference Learning**: Learn individual preferences over time using ML
33. **Contextual Suggestions**: Suggest based on weather, day of week patterns
34. **Suggestion Analytics**: Track which suggestions get accepted vs. rejected
35. **Menu Previews**: Display menu previews with images
36. **Booking Integration**: OpenTable integration for table booking
37. **User-Generated Content**: User-submitted photos and notes
38. **Price Comparison**: Compare prices across similar restaurants

### Feature Categorization:

- **Must-Have Features (Phase 1 MVP):**
  - Location detection and setting
  - Restaurant discovery via Google Places API
  - Restaurant display with basic info
  - Food type filtering
  - Establishment type filtering
  - Distance/walk time filtering
  - Mobile-responsive interface

- **Should-Have Features (Phase 1 Nice-to-Have):**
  - User accounts and authentication
  - Dietary requirements storage
  - Lunch group creation and management
  - Group-based dietary filtering

- **Nice-to-Have Features (Phase 2+):**
  - Visit tracking and history
  - Smart ranking algorithms
  - Voting system
  - Enhanced restaurant data (hours, prices, ratings)
  - Weather-aware suggestions
  - Platform integrations (Slack, WhatsApp)
  - Machine learning preferences

## Data Model Analysis

### Identified Entities:

1. **User**: Represents a user account with profile information, dietary requirements, and preferences
2. **LunchGroup**: Represents a lunch planning session for a specific date with participants
3. **Restaurant**: Cached restaurant data from Google Places API with additional metadata
4. **Vote**: Represents a user's vote for a restaurant in a lunch group
5. **VisitHistory**: Tracks historical visits to restaurants by lunch groups
6. **DietaryRequirement**: Enum/table for standard dietary requirements (vegetarian, vegan, etc.)
7. **RestaurantCategory**: Food type categories (Italian, Asian, etc.)
8. **RestaurantType**: Establishment types (sit-down, takeaway, café)

### Entity Relationships:

- **User** has many **LunchGroup** (as participant)
- **LunchGroup** has many **User** (many-to-many: participants)
- **LunchGroup** has many **Vote** (one-to-many)
- **Vote** belongs to **User** and **Restaurant** and **LunchGroup**
- **VisitHistory** belongs to **LunchGroup** and **Restaurant**
- **Restaurant** has many **Vote** (one-to-many)
- **Restaurant** has many **VisitHistory** (one-to-many)
- **Restaurant** belongs to many **RestaurantCategory** (many-to-many)
- **Restaurant** belongs to one **RestaurantType** (many-to-one)
- **User** has many **DietaryRequirement** (many-to-many)

### Required CRUD Operations:

#### User Entity:
- **Create**: Register new user account
- **Read**: Get user profile, get user by ID
- **Update**: Update profile, dietary requirements, preferences, default location
- **Delete**: Delete user account (soft delete)

#### LunchGroup Entity:
- **Create**: Create new lunch group for today
- **Read**: Get lunch group by ID, get active lunch groups, get lunch group participants
- **Update**: Update lunch group status, add/remove participants
- **Delete**: Cancel/delete lunch group

#### Restaurant Entity:
- **Create**: Cache restaurant from Google Places API
- **Read**: Get restaurant by ID, search nearby restaurants, get filtered restaurants
- **Update**: Update cached data (ratings, hours, etc.)
- **Delete**: Remove restaurant from cache (rare, usually for data cleanup)

#### Vote Entity:
- **Create**: Cast vote for restaurant in lunch group
- **Read**: Get votes for lunch group, get user's vote
- **Update**: Change vote (if allowed)
- **Delete**: Remove vote

#### VisitHistory Entity:
- **Create**: Log visit to restaurant by lunch group
- **Read**: Get visit history for restaurant, get recent visits for group
- **Update**: Update visit notes (if needed)
- **Delete**: Remove visit record (rare)

## Page and Component Analysis

### Core Pages:

1. **Home/Landing Page** (`/`): 
   - Quick access to create/join lunch group
   - Show active lunch groups
   - Location selector if not set

2. **Restaurant List Page** (`/restaurants`):
   - Display filtered and ranked restaurant list
   - Filter controls (food type, establishment type, distance)
   - Map view toggle (future enhancement)

3. **Lunch Group Page** (`/groups/:id`):
   - Show group participants
   - Display filtered restaurant suggestions
   - Voting interface (Phase 2)
   - Group status and results

4. **Profile/Settings Page** (`/profile`):
   - User profile information
   - Dietary requirements management
   - Default location setting
   - Food preferences (Phase 2)

5. **Login/Register Page** (`/auth/login`, `/auth/register`):
   - User authentication
   - Account creation
   - Social login options (optional)

6. **Restaurant Detail Page** (`/restaurants/:id`):
   - Detailed restaurant information
   - Distance and walk time
   - Opening hours
   - Ratings and reviews (cached from Google)

### Shared Components:

1. **Header/Navigation**: 
   - App logo/branding
   - Navigation menu
   - User profile link
   - Login/logout button

2. **LocationSelector**: 
   - Current location detection
   - Manual location input
   - Office location setting

3. **RestaurantCard**: 
   - Restaurant name and type
   - Distance and walk time
   - Basic info display
   - Action buttons (vote, view details)

4. **FilterPanel**: 
   - Food type filters
   - Establishment type filters
   - Distance/walk time slider
   - Clear filters button

5. **LunchGroupCard**: 
   - Group date and participants
   - Group status
   - Join/leave button

6. **DietaryRequirementSelector**: 
   - Multi-select dietary requirements
   - Visual indicators
   - Save/cancel actions

7. **VoteButton**: 
   - Vote/unvote functionality
   - Vote count display
   - Visual feedback

8. **LoadingSpinner**: 
   - Loading states
   - Skeleton screens

9. **ErrorMessage**: 
   - Error display
   - Retry actions

### Forms and Interactions:

1. **User Registration Form**: 
   - Email, password, name
   - Validation and error handling

2. **User Login Form**: 
   - Email and password
   - Remember me option
   - Forgot password link

3. **Profile Update Form**: 
   - Name, email update
   - Dietary requirements selection
   - Location update

4. **Lunch Group Creation Form**: 
   - Date selection (default: today)
   - Optional description
   - Initial participants (if applicable)

5. **Location Input Form**: 
   - Address search/autocomplete
   - Map picker (optional)
   - Save as default option

6. **Filter Form**: 
   - Multi-select dropdowns
   - Range sliders
   - Real-time filter application

## Recommended Tech Stack

### Frontend:
- **Framework**: Next.js 14 with App Router - Provides server-side rendering, API routes, excellent mobile support, and seamless deployment
- **Documentation**: https://nextjs.org/docs
- **UI Library**: Tailwind CSS + shadcn/ui - Modern, accessible component library with excellent mobile responsiveness
- **Documentation**: https://tailwindcss.com/docs, https://ui.shadcn.com
- **State Management**: React Context API + Zustand (for complex state) - Lightweight, no over-engineering for MVP
- **Documentation**: https://zustand-demo.pmnd.rs
- **Maps Integration**: Google Maps JavaScript API / React Google Maps - For location visualization (future)
- **Documentation**: https://developers.google.com/maps/documentation/javascript

### Backend:
- **Framework**: Next.js API Routes - Full-stack solution, no separate backend needed for MVP
- **Documentation**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Authentication**: NextAuth.js v5 (Auth.js) - Comprehensive auth solution with multiple providers
- **Documentation**: https://authjs.dev
- **API Client**: Built-in fetch with error handling utilities

### Database:
- **Database**: PostgreSQL with PostGIS extension - Excellent for geospatial queries, location-based filtering
- **Documentation**: https://www.postgresql.org/docs, https://postgis.net/documentation
- **ORM**: Prisma - Type-safe database access, excellent developer experience, migration support
- **Documentation**: https://www.prisma.io/docs
- **Alternative Consideration**: Supabase - Provides PostgreSQL + Auth + Real-time in one package
- **Documentation**: https://supabase.com/docs

### Additional Tools:
- **Google Places API**: Restaurant discovery and data
- **Documentation**: https://developers.google.com/maps/documentation/places/web-service
- **Environment Variables**: dotenv for local development
- **Documentation**: https://github.com/motdotla/dotenv
- **Validation**: Zod - Schema validation for API requests and forms
- **Documentation**: https://zod.dev
- **HTTP Client**: Built-in fetch API (Next.js 14+)
- **Deployment**: Vercel - Seamless Next.js deployment with environment variables
- **Documentation**: https://vercel.com/docs
- **Testing**: Vitest + React Testing Library - Fast unit and integration testing
- **Documentation**: https://vitest.dev, https://testing-library.com/react

## Implementation Stages

### Stage 1: Foundation & Setup
**Duration:** 3-5 days
**Dependencies:** None

#### Sub-steps:
- [ ] Set up Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui components
- [ ] Set up project folder structure following conventions
- [ ] Configure environment variables (.env.local, .env.example)
- [ ] Set up PostgreSQL database (local and production)
- [ ] Install and configure Prisma ORM
- [ ] Design and create initial database schema
- [ ] Set up Prisma migrations
- [ ] Configure Google Places API account and get API key
- [ ] Set up Git repository and initial commit
- [ ] Configure ESLint and Prettier
- [ ] Set up basic error handling and logging

### Stage 2: Core Backend & Data Layer
**Duration:** 5-7 days
**Dependencies:** Stage 1 completion

#### Sub-steps:
- [ ] Implement User model and Prisma schema
- [ ] Implement Restaurant model with geospatial fields
- [ ] Implement LunchGroup model and relationships
- [ ] Implement Vote and VisitHistory models
- [ ] Create database seed script for test data
- [ ] Set up NextAuth.js authentication
- [ ] Implement user registration API endpoint
- [ ] Implement user login API endpoint
- [ ] Implement user profile CRUD API endpoints
- [ ] Implement restaurant search API endpoint (Google Places integration)
- [ ] Implement restaurant caching logic
- [ ] Implement distance calculation utilities
- [ ] Implement walk time estimation
- [ ] Set up API route structure and middleware
- [ ] Implement input validation with Zod
- [ ] Implement error handling middleware
- [ ] Create API response utilities

### Stage 3: Frontend Foundation
**Duration:** 4-6 days
**Dependencies:** Stage 2 completion

#### Sub-steps:
- [ ] Create main layout component with header/navigation
- [ ] Implement responsive navigation component
- [ ] Set up Next.js App Router routing structure
- [ ] Create shared UI components (Button, Card, Input, etc.)
- [ ] Implement LoadingSpinner and ErrorMessage components
- [ ] Set up React Context for global state (auth, location)
- [ ] Implement authentication flow (login, register, logout)
- [ ] Create protected route wrapper component
- [ ] Implement location detection component
- [ ] Create location selector component
- [ ] Set up form validation utilities
- [ ] Implement responsive design breakpoints
- [ ] Create theme configuration (colors, typography)

### Stage 4: Core Pages & Features (Phase 1 MVP)
**Duration:** 7-10 days
**Dependencies:** Stage 3 completion

#### Sub-steps:
- [ ] Implement Home/Landing page with active groups display
- [ ] Implement Restaurant List page with basic display
- [ ] Create RestaurantCard component
- [ ] Implement FilterPanel component
- [ ] Integrate food type filtering
- [ ] Integrate establishment type filtering
- [ ] Integrate distance/walk time filtering
- [ ] Implement real-time filter application
- [ ] Create Lunch Group creation page
- [ ] Implement Lunch Group detail page
- [ ] Create group participant management
- [ ] Implement Profile/Settings page
- [ ] Create dietary requirements selector component
- [ ] Implement dietary requirements aggregation logic
- [ ] Integrate group-based restaurant filtering
- [ ] Connect all pages to backend APIs
- [ ] Implement error states and loading states
- [ ] Add form validation and error messages
- [ ] Test complete user flow (create group → filter → select)

### Stage 5: Advanced Features & Integration (Phase 2)
**Duration:** 8-12 days
**Dependencies:** Stage 4 completion

#### Sub-steps:
- [ ] Implement VisitHistory tracking
- [ ] Create visit logging functionality
- [ ] Implement recent visit flagging (7-14 days)
- [ ] Add auto-exclude yesterday's choice logic
- [ ] Implement smart ranking algorithm
- [ ] Add frequency-based boosting
- [ ] Implement new restaurant surfacing logic
- [ ] Create group size suitability weighting
- [ ] Implement voting system backend
- [ ] Create voting UI components
- [ ] Implement vote counting and display
- [ ] Add auto-select winner logic
- [ ] Implement opening hours caching
- [ ] Add price indicator display
- [ ] Integrate multi-source ratings
- [ ] Create Restaurant Detail page
- [ ] Implement menu information display (if available)
- [ ] Add "Today I want..." preference system
- [ ] Implement weather API integration (if applicable)
- [ ] Add weather-aware suggestions

### Stage 6: Polish & Optimization
**Duration:** 5-7 days
**Dependencies:** Stage 5 completion

#### Sub-steps:
- [ ] Conduct comprehensive testing (unit, integration, E2E)
- [ ] Optimize database queries and add indexes
- [ ] Implement API response caching where appropriate
- [ ] Optimize images and assets
- [ ] Add loading skeletons for better UX
- [ ] Enhance error messages and user feedback
- [ ] Implement comprehensive error handling
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Optimize mobile performance and touch interactions
- [ ] Conduct performance audit and optimization
- [ ] Set up monitoring and error tracking (Sentry, etc.)
- [ ] Create deployment configuration
- [ ] Set up production database
- [ ] Configure environment variables for production
- [ ] Deploy to staging environment
- [ ] Conduct user acceptance testing
- [ ] Fix bugs and issues from testing
- [ ] Prepare deployment documentation
- [ ] Deploy to production

## Resource Links

### Technology Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [PostGIS Documentation](https://postgis.net/documentation)
- [NextAuth.js Documentation](https://authjs.dev)
- [Zod Validation](https://zod.dev)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Vercel Deployment Guide](https://vercel.com/docs)

### Best Practices
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing)
- [React Best Practices](https://react.dev/learn)
- [PostgreSQL Geospatial Queries](https://postgis.net/workshops/postgis-intro/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tutorials and Guides
- [Next.js 14 Tutorial](https://nextjs.org/learn)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Google Places API Tutorial](https://developers.google.com/maps/documentation/places/web-service/overview)

## Phase 2 & 3 Roadmap

### Phase 2 Implementation (After MVP Validation)
- Visit tracking and history
- Smart ranking algorithms
- Voting system
- Enhanced restaurant data
- Weather integration

### Phase 3 Implementation (Future)
- Platform integrations (Slack, WhatsApp)
- Machine learning for preferences
- Advanced analytics
- User-generated content
- Booking integrations

## Success Metrics Tracking

### Implementation Metrics
- Code coverage targets: 70%+ for critical paths
- API response time: < 200ms for restaurant search
- Page load time: < 2s on 3G connection
- Mobile performance score: 90+ Lighthouse score

### Business Metrics (Post-Launch)
- Daily active lunch groups
- Time from group creation to decision
- Vote participation rate
- New restaurant discovery rate
- User retention rate

