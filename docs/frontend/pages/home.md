# Home Page

## Overview
The home page is the landing page and primary entry point for users. It provides quick access to create or join lunch groups, displays active groups, and allows location configuration.

## URL Route
`/`

## User Access Requirements
- Authentication: Optional
- User Roles: Any user (authenticated or guest)
- Permissions: None required

## Page Components

### Layout Components Used
- [x] Header
- [x] Navigation
- [ ] Footer (optional)
- [ ] Sidebar (optional, for active groups on desktop)

### Page-Specific Components
- **QuickActionCard**: Prominent "Create Lunch Group" button/card
- **ActiveGroupsList**: List of active lunch groups user can join
- **LocationSelector**: Location input/selector if not set
- **WelcomeMessage**: Greeting and brief instructions

## Data Requirements

### Data Sources
- API Endpoints: 
  - `GET /api/v1/lunch-groups?date=today` - Get active groups for today
  - `GET /api/v1/users/me` - Get current user (if authenticated)
- Local State: 
  - Current location
  - Active groups list
  - User authentication state
- Global State: 
  - User session (via AuthContext)
  - Location context (via LocationContext)

### Data Operations
- **Create**: Create new lunch group (redirects to group creation page)
- **Read**: Display active lunch groups, user profile info
- **Update**: Update location preference
- **Delete**: None on this page

## User Interactions

### Primary Actions
- **Create Lunch Group**: Large, prominent button that navigates to group creation
- **Join Group**: Click on active group card to join
- **Set Location**: Configure default or current location

### Secondary Actions
- **View Profile**: Navigate to profile page (if authenticated)
- **View All Groups**: Navigate to groups list page
- **Search Restaurants**: Quick link to restaurant search

### Form Submissions
- **Location Form**: Submit location to update user preference or session

### Navigation
- **From**: Login/Register pages, other app pages
- **To**: 
  - `/groups/new` - Create group
  - `/groups/:id` - Join/view group
  - `/restaurants` - Browse restaurants
  - `/profile` - User profile

## Responsive Design

### Mobile Behavior
- Single column layout
- Full-width quick action button
- Stacked active groups list
- Bottom sheet for location selector
- Bottom navigation bar (optional)

### Tablet Behavior
- 2-column layout for active groups
- Side panel for location settings
- Larger touch targets

### Desktop Behavior
- Centered content (max-width: 1200px)
- 3-column grid for active groups
- Persistent sidebar for quick actions
- Hover states on interactive elements

## Accessibility Requirements

### ARIA Labels
- `aria-label="Create new lunch group"` on primary button
- `aria-label="Join lunch group"` on group cards
- `aria-label="Set location"` on location selector
- `role="main"` on main content area
- `role="navigation"` on navigation elements

### Keyboard Navigation
- Tab order: Logo → Create Button → Active Groups → Location → Profile
- Enter/Space to activate buttons
- Arrow keys for group list navigation (if implemented)

### Screen Reader Support
- Announce page title on load
- Announce active groups count
- Describe location status
- Announce authentication state

## Performance Considerations

### Loading Strategy
- Server-side render initial page
- Client-side fetch active groups
- Lazy load group details on interaction
- Cache location data in localStorage

### Optimization
- Static generation for base page
- Incremental static regeneration for active groups
- Image optimization for avatars/icons
- Code splitting for group components

### Caching
- Cache active groups for 30 seconds
- Cache user location in session storage
- Cache user profile data

## Error Handling

### Error States
- **No Active Groups**: Show empty state with "Create Group" CTA
- **Location Error**: Show error message with retry option
- **API Error**: Show toast notification with retry
- **Network Error**: Show offline indicator

### Validation
- Location coordinates validation
- Date validation for group filtering

### Fallbacks
- Default location if geolocation fails
- Guest mode if authentication fails
- Cached groups if API unavailable

## Testing Requirements

### Unit Tests
- Home page component rendering
- Active groups list component
- Location selector component
- Quick action button

### Integration Tests
- User flow: Create group from home
- User flow: Join group from home
- Location setting and persistence
- Active groups data fetching

### E2E Tests
- Complete flow: Home → Create Group → Select Restaurant
- Complete flow: Home → Join Group → Vote
- Location detection and setting
- Authentication state handling

