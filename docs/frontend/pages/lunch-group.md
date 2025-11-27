# Lunch Group Page

## Overview
The lunch group page displays a specific lunch group with participants, filtered restaurant suggestions, voting interface, and group management options.

## URL Route
`/groups/:id`

## User Access Requirements
- Authentication: Required (to join/vote)
- User Roles: Participant or creator
- Permissions: 
  - View: Must be participant
  - Vote: Must be participant
  - Manage: Creator or participant (for some actions)

## Page Components

### Layout Components Used
- [x] Header
- [x] Navigation
- [ ] Footer (optional)

### Page-Specific Components
- **GroupHeader**: Group date, status, share button
- **ParticipantList**: List of group participants with avatars
- **AddParticipantButton**: Add user to group
- **RestaurantSuggestions**: Filtered restaurant list for group
- **VoteSection**: Voting interface (Phase 2)
- **VoteResults**: Vote count display (Phase 2)
- **GroupActions**: Finalize decision, cancel group

## Data Requirements

### Data Sources
- API Endpoints: 
  - `GET /api/v1/lunch-groups/:id` - Get group details
  - `GET /api/v1/lunch-groups/:id/restaurants` - Get suggested restaurants
  - `GET /api/v1/lunch-groups/:id/votes` - Get votes (Phase 2)
  - `POST /api/v1/lunch-groups/:id/participants` - Add participant
  - `POST /api/v1/lunch-groups/:id/votes` - Cast vote (Phase 2)
  - `PATCH /api/v1/lunch-groups/:id` - Update group status
- Local State: 
  - Group data
  - Participants list
  - Restaurant suggestions
  - Votes (Phase 2)
  - Selected restaurant
- Global State: 
  - User session
  - Real-time updates (Phase 2)

### Data Operations
- **Create**: Add participant, cast vote (Phase 2)
- **Read**: Display group, participants, restaurants, votes
- **Update**: Update group status, change vote (Phase 2)
- **Delete**: Remove participant, remove vote (Phase 2)

## User Interactions

### Primary Actions
- **Join Group**: Add self to group (if not participant)
- **Vote for Restaurant**: Cast vote for preferred option (Phase 2)
- **Finalize Decision**: Mark group as decided with selected restaurant
- **Add Participant**: Invite user to group

### Secondary Actions
- **Share Group**: Copy group link or share via platform
- **View Restaurant Details**: Navigate to restaurant detail page
- **Leave Group**: Remove self from group
- **Cancel Group**: Delete group (creator only)

### Form Submissions
- **Add Participant Form**: Submit user email/ID
- **Vote Form**: Submit restaurant selection (Phase 2)

### Navigation
- **From**: Home page, groups list, restaurant list
- **To**: 
  - `/restaurants/:id` - Restaurant detail
  - `/restaurants` - Browse all restaurants
  - `/groups` - Groups list
  - `/` - Home page

## Responsive Design

### Mobile Behavior
- Full-width layout
- Collapsible participant section
- Bottom sheet for actions
- Swipeable restaurant cards
- Sticky vote button (Phase 2)

### Tablet Behavior
- 2-column layout (participants + restaurants)
- Side panel for group info
- Larger interactive elements

### Desktop Behavior
- 3-column layout (participants | restaurants | votes)
- Persistent sidebar for group info
- Hover states and tooltips
- Keyboard shortcuts

## Accessibility Requirements

### ARIA Labels
- `aria-label="Lunch group"` on main container
- `aria-label="Add participant"` on add button
- `aria-label="Vote for [restaurant]"` on vote buttons
- `aria-label="Group status: [status]"` on status badge
- `role="list"` on participant and restaurant lists
- `aria-live="polite"` for real-time updates

### Keyboard Navigation
- Tab through participants, restaurants, actions
- Enter/Space to vote or join
- Arrow keys for restaurant navigation
- Escape to close modals

### Screen Reader Support
- Announce group status changes
- Announce new participants
- Announce vote updates (Phase 2)
- Describe restaurant suggestions

## Performance Considerations

### Loading Strategy
- Server-side render group data
- Client-side fetch restaurants and votes
- Real-time updates via polling or WebSocket (Phase 2)
- Optimistic UI updates for votes

### Optimization
- Memoized restaurant filtering
- Virtual scrolling for long restaurant lists
- Debounced participant search
- Lazy load restaurant details

### Caching
- Cache group data for 30 seconds
- Cache restaurant suggestions for 1 minute
- Cache votes for real-time updates (Phase 2)

## Error Handling

### Error States
- **Group Not Found**: Show 404 error with link to home
- **Not a Participant**: Show join prompt or access denied
- **No Restaurants**: Show empty state with filter suggestions
- **API Error**: Show retry button
- **Vote Error**: Show error message with retry (Phase 2)

### Validation
- Participant ID validation
- Vote validation (must be participant, valid restaurant)
- Group status transition validation

### Fallbacks
- Show cached group data if API fails
- Default restaurant list if filtering fails
- Offline mode with cached data

## Testing Requirements

### Unit Tests
- GroupHeader component
- ParticipantList component
- VoteSection component (Phase 2)
- Restaurant filtering logic

### Integration Tests
- Join group flow
- Vote casting and counting (Phase 2)
- Participant addition
- Group status updates
- Real-time updates (Phase 2)

### E2E Tests
- Complete flow: Create group → Add participants → Vote → Decide
- Multi-user voting scenario (Phase 2)
- Group sharing and joining
- Restaurant selection and finalization

