# Restaurant List Page

## Overview
The restaurant list page displays nearby restaurants filtered by location, dietary requirements, and user preferences. It provides filtering capabilities and restaurant details for decision-making.

## URL Route
`/restaurants`

## User Access Requirements
- Authentication: Optional (enhanced features for authenticated users)
- User Roles: Any user
- Permissions: None required

## Page Components

### Layout Components Used
- [x] Header
- [x] Navigation
- [ ] Footer (optional)

### Page-Specific Components
- **RestaurantList**: Container for restaurant cards
- **RestaurantCard**: Individual restaurant display card
- **FilterPanel**: Collapsible filter sidebar/sheet
- **SearchBar**: Restaurant name search (optional)
- **MapToggle**: Switch between list and map view (future)
- **SortSelector**: Sort options (distance, rating, etc.)

## Data Requirements

### Data Sources
- API Endpoints: 
  - `GET /api/v1/restaurants/search` - Search nearby restaurants
  - `GET /api/v1/lunch-groups/:id` - Get current group context (if applicable)
- Local State: 
  - Filter selections
  - Sort preference
  - Search query
  - Selected restaurant
- Global State: 
  - Current location
  - Active lunch group (if applicable)
  - User dietary requirements

### Data Operations
- **Create**: None directly (restaurants created via Google Places API)
- **Read**: Display restaurant list with filters applied
- **Update**: Update filters, sort order
- **Delete**: None

## User Interactions

### Primary Actions
- **View Restaurant Details**: Click restaurant card to see details
- **Apply Filters**: Select food types, distance, establishment type
- **Vote for Restaurant**: Cast vote if in lunch group context (Phase 2)
- **Share Restaurant**: Share restaurant with group

### Secondary Actions
- **Clear Filters**: Reset all filters
- **Sort Results**: Change sort order (distance, rating, name)
- **Refresh Results**: Reload restaurant data
- **Get Directions**: Open maps app with directions

### Form Submissions
- **Filter Form**: Real-time filter application
- **Search Form**: Restaurant name search

### Navigation
- **From**: Home page, lunch group page
- **To**: 
  - `/restaurants/:id` - Restaurant detail page
  - `/groups/:id` - Return to group (if applicable)
  - `/` - Home page

## Responsive Design

### Mobile Behavior
- Full-width restaurant cards
- Bottom sheet for filters
- Swipeable cards (optional)
- Sticky filter button at top
- Infinite scroll or pagination

### Tablet Behavior
- 2-column grid for restaurants
- Slide-out filter panel
- Larger cards with more details

### Desktop Behavior
- 3-column grid for restaurants
- Persistent sidebar filters
- Hover states for cards
- Keyboard shortcuts for filters

## Accessibility Requirements

### ARIA Labels
- `aria-label="Restaurant list"` on main container
- `aria-label="Filter restaurants"` on filter button
- `aria-label="View restaurant details"` on cards
- `aria-label="Sort by"` on sort selector
- `role="list"` on restaurant list
- `role="listitem"` on restaurant cards

### Keyboard Navigation
- Tab through filter controls
- Arrow keys to navigate restaurant list
- Enter/Space to select restaurant
- Escape to close filter panel

### Screen Reader Support
- Announce filter changes
- Announce result count
- Describe restaurant details
- Announce sort order

## Performance Considerations

### Loading Strategy
- Initial load: Show skeleton screens
- Progressive loading: Load restaurants in batches
- Lazy loading: Load images as cards come into view
- Debounced search: Wait for user to stop typing

### Optimization
- Virtual scrolling for long lists
- Image lazy loading with placeholders
- Memoized filter calculations
- Debounced API calls

### Caching
- Cache restaurant search results for 5 minutes
- Cache filter preferences in localStorage
- Cache restaurant details for 1 hour

## Error Handling

### Error States
- **No Results**: Show empty state with filter suggestions
- **Location Error**: Show error with location selector
- **API Error**: Show retry button
- **Network Error**: Show offline indicator with cached results

### Validation
- Location coordinates validation
- Filter value validation
- Search query sanitization

### Fallbacks
- Show cached results if API fails
- Default filters if invalid
- Placeholder images for missing photos

## Testing Requirements

### Unit Tests
- RestaurantCard component
- FilterPanel component
- RestaurantList component
- Filter logic and calculations

### Integration Tests
- Filter application and result updates
- Restaurant search functionality
- Sort functionality
- Pagination/infinite scroll

### E2E Tests
- Complete flow: Set location → Apply filters → View restaurant
- Filter persistence across page reloads
- Restaurant detail navigation
- Vote functionality (Phase 2)

