# Restaurant Detail Page

## Overview
The restaurant detail page displays comprehensive information about a specific restaurant, including location, ratings, opening hours, and options to vote or get directions.

## URL Route
`/restaurants/:id`

## User Access Requirements
- Authentication: Optional (required for voting)
- User Roles: Any user
- Permissions: None required

## Page Components

### Layout Components Used
- [x] Header
- [x] Navigation
- [ ] Footer (optional)

### Page-Specific Components
- **RestaurantHeader**: Name, rating, price level
- **RestaurantImage**: Photo gallery (if available)
- **RestaurantInfo**: Address, phone, website
- **OpeningHours**: Opening hours display
- **RestaurantActions**: Vote button, get directions, share
- **MapView**: Embedded map (future)
- **VisitHistory**: Recent visits by groups (Phase 2)

## Data Requirements

### Data Sources
- API Endpoints: 
  - `GET /api/v1/restaurants/:id` - Get restaurant details
  - `GET /api/v1/restaurants/:id/visits` - Get visit history (Phase 2)
  - `POST /api/v1/lunch-groups/:id/votes` - Cast vote (if in group context)
- Local State: 
  - Restaurant data
  - Visit history (Phase 2)
  - Vote status (if in group)
- Global State: 
  - Current location (for distance calculation)
  - Active lunch group (if applicable)

### Data Operations
- **Create**: Cast vote (if in group context)
- **Read**: Display restaurant details, visit history
- **Update**: None
- **Delete**: None

## User Interactions

### Primary Actions
- **Vote for Restaurant**: Cast vote if in lunch group (Phase 2)
- **Get Directions**: Open maps app with directions
- **Share Restaurant**: Share restaurant link
- **Call Restaurant**: Initiate phone call (mobile)

### Secondary Actions
- **View on Google Maps**: Open in Google Maps
- **Visit Website**: Open restaurant website
- **View Photos**: Browse photo gallery (if available)
- **Add to Favorites**: Save restaurant (future)

### Form Submissions
- **Vote Form**: Submit vote for restaurant (Phase 2)

### Navigation
- **From**: Restaurant list, lunch group page
- **To**: 
  - `/restaurants` - Back to list
  - `/groups/:id` - Return to group
  - External: Maps, website, phone

## Responsive Design

### Mobile Behavior
- Full-width layout
- Sticky action buttons at bottom
- Swipeable photo gallery
- Collapsible sections
- Touch-friendly buttons

### Tablet Behavior
- 2-column layout (info + map)
- Larger images
- Side panel for actions

### Desktop Behavior
- 3-column layout (info | map | actions)
- Hover effects on images
- Keyboard shortcuts
- Larger map view

## Accessibility Requirements

### ARIA Labels
- `aria-label="Restaurant details"` on main container
- `aria-label="Get directions to [name]"` on directions button
- `aria-label="Call [name]"` on phone button
- `aria-label="Visit website"` on website link
- `role="img"` on restaurant photos with alt text

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for photo navigation
- Escape to close modals

### Screen Reader Support
- Announce restaurant name and key details
- Describe location and distance
- Announce opening hours status
- Describe action buttons

## Performance Considerations

### Loading Strategy
- Server-side render restaurant data
- Lazy load images
- Progressive image loading
- Client-side fetch visit history (Phase 2)

### Optimization
- Image optimization and lazy loading
- Memoized distance calculations
- Cached restaurant data
- Code splitting for map component (future)

### Caching
- Cache restaurant details for 1 hour
- Cache visit history for 5 minutes (Phase 2)
- Cache images in browser

## Error Handling

### Error States
- **Restaurant Not Found**: Show 404 error with link to list
- **Load Error**: Show retry button
- **Network Error**: Show offline indicator
- **Vote Error**: Show error message (Phase 2)

### Validation
- Restaurant ID validation
- Vote validation (must be in group, Phase 2)

### Fallbacks
- Show cached restaurant data if API fails
- Placeholder image if photo unavailable
- Default map view if location unavailable

## Testing Requirements

### Unit Tests
- RestaurantHeader component
- RestaurantInfo component
- OpeningHours component
- RestaurantActions component

### Integration Tests
- Restaurant data fetching
- Vote functionality (Phase 2)
- Directions link generation
- Share functionality

### E2E Tests
- Complete flow: List → Detail → Vote → Return
- Directions functionality
- Share functionality
- Photo gallery navigation

