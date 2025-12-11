# Stage 3 Testing Guide

## Quick Start

The development server should be running at: **http://localhost:3000**

## What to Test

### 1. Home Page & Layout
- ✅ **Header Navigation**
  - Should see "Lunch Chooser" logo
  - Navigation links (Home, Restaurants, Groups, Profile)
  - "Sign In" button (if not logged in)
  - User dropdown menu (if logged in)

- ✅ **Home Page Content**
  - Welcome message
  - Location selector card
  - "Browse Restaurants" card
  - "Create Lunch Group" card

### 2. Location Features
- ✅ **Location Detection**
  - Click "Use Current Location" button
  - Should prompt for browser geolocation permission
  - Should display coordinates after detection
  - Should save to localStorage

- ✅ **Location Selector**
  - Should show current location if detected
  - Address input field (note: geocoding not yet implemented)

### 3. Authentication Flow

#### Registration
1. Click "Sign In" → Click "Sign up" link
2. Fill out registration form:
   - Name
   - Email
   - Password (min 8 characters)
   - Confirm Password
3. Submit form
4. Should auto-login and redirect to home page

#### Login
1. Navigate to `/auth/login`
2. Enter email and password
3. Click "Sign In"
4. Should redirect to home page
5. Header should show user menu

#### Logout
1. Click user menu in header
2. Click "Sign Out"
3. Should redirect to home page
4. Should show "Sign In" button again

### 4. Protected Routes
- ✅ **Navigation Changes**
  - When logged out: Only see Home and Restaurants links
  - When logged in: See Home, Restaurants, Groups, and Profile links

- ✅ **Profile Page** (if created)
  - Should require authentication
  - Should redirect to login if not authenticated

### 5. Responsive Design
- ✅ **Mobile View** (resize browser to < 640px)
  - Navigation should show icons only
  - Header should be compact
  - Cards should stack vertically

- ✅ **Tablet View** (640px - 1024px)
  - Navigation should show icons + text
  - Cards should be in grid layout

- ✅ **Desktop View** (> 1024px)
  - Full navigation with labels
  - Multi-column layouts

### 6. UI Components

#### Loading States
- ✅ **LoadingSpinner**
  - Should see spinner when:
    - Detecting location
    - Submitting forms
    - Loading data

#### Error States
- ✅ **ErrorMessage**
  - Should appear on form errors
  - Should have "Try Again" button
  - Should be dismissible

#### Empty States
- ✅ **EmptyState** (if used)
  - Should show icon, title, and message
  - Should have optional action button

### 7. Form Validation

#### Registration Form
- ✅ **Email Validation**
  - Invalid email should show error
  - Valid email should be accepted

- ✅ **Password Validation**
  - Password < 8 chars should show error
  - Passwords don't match should show error
  - Valid password should be accepted

#### Login Form
- ✅ **Required Fields**
  - Empty email/password should show validation
  - Invalid credentials should show error message

## Testing Checklist

### Basic Functionality
- [ ] Home page loads correctly
- [ ] Header displays with navigation
- [ ] Location detection works
- [ ] Location saves to localStorage
- [ ] Registration form works
- [ ] Login form works
- [ ] Logout works
- [ ] Navigation updates based on auth state

### UI/UX
- [ ] Loading spinners appear during async operations
- [ ] Error messages display correctly
- [ ] Forms validate input
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All buttons and links are clickable
- [ ] Navigation highlights active route

### Edge Cases
- [ ] Geolocation permission denied → shows error
- [ ] Invalid login credentials → shows error
- [ ] Duplicate email registration → shows error
- [ ] Network errors → shows error message

## Known Limitations

1. **Address Geocoding**: The address search in LocationSelector is a placeholder. It will show an alert saying geocoding will be implemented later.

2. **Profile Page**: Not yet implemented (Stage 4)

3. **Restaurant Pages**: Not yet implemented (Stage 4)

4. **Group Pages**: Not yet implemented (Stage 4)

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify `.env.local` has required variables
- Run `npm install` if dependencies are missing

### Authentication not working
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Check database connection
- Ensure user exists in database

### Location detection not working
- Check browser permissions for geolocation
- Try in different browser
- Check browser console for errors

### TypeScript errors
- Run `npm run type-check` to see all errors
- Ensure all imports are correct
- Check that all components are properly typed

## Next Steps After Testing

Once Stage 3 is verified working:
1. Proceed to Stage 4: Core Pages & Features
2. Implement Restaurant List page
3. Implement Lunch Group pages
4. Implement Profile page
5. Connect all pages to backend APIs
