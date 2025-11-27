# Profile/Settings Page

## Overview
The profile page allows users to manage their account information, dietary requirements, location preferences, and food preferences.

## URL Route
`/profile`

## User Access Requirements
- Authentication: Required
- User Roles: Authenticated user (own profile only)
- Permissions: Can only edit own profile

## Page Components

### Layout Components Used
- [x] Header
- [x] Navigation
- [ ] Footer (optional)

### Page-Specific Components
- **ProfileHeader**: User name, avatar, edit button
- **ProfileForm**: Personal information form
- **DietaryRequirementSelector**: Multi-select dietary requirements
- **LocationSettings**: Default location configuration
- **PreferencesSection**: Food preferences (Phase 2)
- **AccountSettings**: Account management (delete account, etc.)

## Data Requirements

### Data Sources
- API Endpoints: 
  - `GET /api/v1/users/me` - Get current user profile
  - `PATCH /api/v1/users/me` - Update profile
  - `PUT /api/v1/users/me/dietary-requirements` - Update dietary requirements
  - `GET /api/v1/dietary-requirements` - Get available dietary requirements
- Local State: 
  - Form data
  - Validation errors
  - Save status
- Global State: 
  - User session
  - Location context

### Data Operations
- **Create**: None
- **Read**: Display user profile, dietary requirements, preferences
- **Update**: Update name, email, location, dietary requirements, preferences
- **Delete**: Delete account (future)

## User Interactions

### Primary Actions
- **Save Changes**: Submit form to update profile
- **Select Dietary Requirements**: Choose from available options
- **Set Default Location**: Configure location preference
- **Update Preferences**: Set food preferences (Phase 2)

### Secondary Actions
- **Cancel Changes**: Discard unsaved changes
- **Change Password**: Navigate to password change (if using password auth)
- **Delete Account**: Remove account (with confirmation)
- **Export Data**: Download user data (GDPR compliance)

### Form Submissions
- **Profile Form**: Update name, email, location
- **Dietary Requirements Form**: Update dietary requirements
- **Preferences Form**: Update food preferences (Phase 2)

### Navigation
- **From**: Home page, any page via profile link
- **To**: 
  - `/` - Home page
  - `/auth/change-password` - Password change (if applicable)

## Responsive Design

### Mobile Behavior
- Single column form layout
- Full-width input fields
- Bottom sheet for dietary requirements
- Sticky save button
- Swipeable sections (optional)

### Tablet Behavior
- 2-column layout for form fields
- Side panel for settings
- Larger touch targets

### Desktop Behavior
- Centered form (max-width: 800px)
- Sidebar for navigation sections
- Inline editing for some fields
- Hover states and tooltips

## Accessibility Requirements

### ARIA Labels
- `aria-label="User profile"` on main container
- `aria-label="Edit profile"` on edit button
- `aria-label="Save changes"` on save button
- `aria-label="Dietary requirement: [name]"` on checkboxes
- `aria-describedby` for form field descriptions
- `role="form"` on form elements

### Keyboard Navigation
- Tab through form fields
- Enter to submit form
- Escape to cancel
- Arrow keys for dietary requirement selection

### Screen Reader Support
- Announce form field labels
- Announce validation errors
- Announce save success/failure
- Describe dietary requirements

## Performance Considerations

### Loading Strategy
- Server-side render initial profile data
- Client-side form handling
- Optimistic UI updates
- Debounced location search

### Optimization
- Memoized form validation
- Lazy load preference sections (Phase 2)
- Image optimization for avatar
- Code splitting for account settings

### Caching
- Cache profile data for session
- Cache dietary requirements list
- Cache location data in localStorage

## Error Handling

### Error States
- **Validation Errors**: Show inline error messages
- **Save Error**: Show toast notification with retry
- **Network Error**: Show offline indicator
- **Permission Error**: Show access denied message

### Validation
- Email format validation
- Name length validation
- Location coordinates validation
- Required field validation

### Fallbacks
- Show cached profile data if API fails
- Default dietary requirements if load fails
- Local storage backup for form data

## Testing Requirements

### Unit Tests
- ProfileForm component
- DietaryRequirementSelector component
- LocationSettings component
- Form validation logic

### Integration Tests
- Profile update flow
- Dietary requirements update
- Location setting and persistence
- Form submission and error handling

### E2E Tests
- Complete flow: View profile → Edit → Save → Verify
- Dietary requirements selection and saving
- Location update and default setting
- Account deletion flow (if implemented)

