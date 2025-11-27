# UI/UX Documentation

## Overview
This document defines the user interface design, user experience flows, component specifications, and accessibility requirements for the Lunch Decision Tool.

## Design Principles

### Core Principles
1. **Speed First**: Users should get lunch suggestions in under 30 seconds
2. **Mobile-First**: Optimized for mobile devices, enhanced for desktop
3. **Simplicity**: Minimal cognitive load, clear actions
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Consistency**: Unified design language across all pages

### Design System

#### Color Palette
```css
/* Primary Colors */
--primary: #3B82F6;        /* Blue - Primary actions */
--primary-dark: #2563EB;   /* Darker blue for hover */
--primary-light: #60A5FA;  /* Lighter blue for subtle elements */

/* Secondary Colors */
--secondary: #10B981;       /* Green - Success states */
--secondary-dark: #059669;
--secondary-light: #34D399;

/* Neutral Colors */
--background: #FFFFFF;     /* White background */
--surface: #F9FAFB;       /* Light gray for cards */
--border: #E5E7EB;        /* Border color */
--text-primary: #111827;  /* Main text */
--text-secondary: #6B7280; /* Secondary text */
--text-muted: #9CA3AF;    /* Muted text */

/* Status Colors */
--success: #10B981;        /* Success messages */
--warning: #F59E0B;        /* Warning messages */
--error: #EF4444;          /* Error messages */
--info: #3B82F6;          /* Info messages */
```

#### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Spacing
```css
/* Spacing Scale (Tailwind) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

#### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px; /* Full circle */
```

#### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Component Library

### Base Components (shadcn/ui)

#### Button
- **Variants**: Primary, Secondary, Outline, Ghost, Destructive
- **Sizes**: Small, Medium, Large
- **States**: Default, Hover, Active, Disabled, Loading
- **Accessibility**: Keyboard focus, ARIA labels

#### Card
- **Usage**: Restaurant cards, group cards, content containers
- **Variants**: Default, Elevated, Outlined
- **Components**: Header, Content, Footer sections

#### Input
- **Types**: Text, Email, Password, Number, Search
- **States**: Default, Focus, Error, Disabled
- **Features**: Labels, Placeholders, Error messages, Icons

#### Select
- **Usage**: Dropdowns for filters, category selection
- **Features**: Searchable, Multi-select option
- **Accessibility**: Keyboard navigation, Screen reader support

## User Flows

### Flow 1: Quick Lunch Decision (Unauthenticated)

```
1. User opens app
   └─> Home page loads
   
2. User sets/confirms location
   └─> Location selector appears
   └─> User selects "Use current location" or enters address
   
3. App fetches nearby restaurants
   └─> Loading state shown
   └─> Restaurant list displayed
   
4. User applies filters (optional)
   └─> Filter panel opens
   └─> User selects food type, distance, etc.
   └─> Results update in real-time
   
5. User selects restaurant
   └─> Restaurant detail shown
   └─> User can share or get directions
```

### Flow 2: Group Lunch Decision (Authenticated)

```
1. User logs in
   └─> Authentication page
   └─> Redirect to home
   
2. User creates lunch group
   └─> "Create Group" button
   └─> Group creation form
   └─> Group created, user added as participant
   
3. Other users join group
   └─> Share group link or users join from home page
   └─> Participants list updates
   
4. App aggregates dietary requirements
   └─> Automatic filtering applied
   └─> Restaurant list filtered
   
5. Group votes on options (Phase 2)
   └─> Top 3-5 restaurants shown
   └─> Users cast votes
   └─> Results displayed in real-time
   
6. Group selects restaurant
   └─> Winner auto-selected or manually chosen
   └─> Visit logged (Phase 2)
```

### Flow 3: Profile Setup

```
1. User registers account
   └─> Registration form
   └─> Email verification (optional)
   
2. User sets dietary requirements
   └─> Profile page
   └─> Dietary requirement selector
   └─> Multiple selections allowed
   
3. User sets default location
   └─> Location settings
   └─> Save as default
   
4. User sets preferences (Phase 2)
   └─> Food preferences
   └─> Cuisine preferences
```

## Page Specifications

### Home Page

#### Layout
- **Header**: App logo, navigation, user menu
- **Main Content**: 
  - Quick action: "Create Lunch Group" button (prominent)
  - Active groups list (if authenticated)
  - Location selector (if not set)
- **Footer**: Links, copyright

#### Mobile Layout
- Full-width components
- Stacked layout
- Bottom navigation bar (optional)
- Swipeable cards

#### Desktop Layout
- Centered content (max-width: 1200px)
- Sidebar for active groups (optional)
- Grid layout for groups

#### Interactions
- **Primary Action**: Create group button (large, prominent)
- **Secondary Actions**: Join group, view profile
- **Location**: Auto-detect or manual entry

### Restaurant List Page

#### Layout
- **Header**: Back button, page title, filter toggle
- **Filters Panel**: Collapsible sidebar (desktop) or bottom sheet (mobile)
- **Restaurant List**: Scrollable list of restaurant cards
- **Map Toggle**: Switch between list and map view (future)

#### Restaurant Card Design
```
┌─────────────────────────────────┐
│ Restaurant Name          Rating  │
│ Food Type • Establishment Type   │
│                                  │
│ 📍 0.5 km • 🚶 6 min walk        │
│                                  │
│ [Vote] [View Details]            │
└─────────────────────────────────┘
```

#### Filter Panel
- **Food Types**: Multi-select checkboxes
- **Establishment Types**: Radio buttons or chips
- **Distance**: Slider (0-5 km)
- **Walk Time**: Slider (0-30 min)
- **Clear Filters**: Button to reset

#### Responsive Behavior
- **Mobile**: Full-width cards, bottom sheet filters
- **Tablet**: 2-column grid, side panel filters
- **Desktop**: 3-column grid, persistent sidebar filters

### Lunch Group Page

#### Layout
- **Header**: Group date, status badge, share button
- **Participants Section**: Avatar list, add participant button
- **Restaurant Suggestions**: Filtered and ranked list
- **Voting Section** (Phase 2): Vote buttons, results display
- **Actions**: Finalize decision, cancel group

#### Status Indicators
- **Planning**: Blue badge, "Planning lunch..."
- **Voting**: Yellow badge, "Voting in progress..."
- **Decided**: Green badge, "Going to [Restaurant]"
- **Completed**: Gray badge, "Completed"

#### Real-time Updates
- Participant list updates when users join
- Vote counts update in real-time (Phase 2)
- Status changes reflected immediately

### Profile Page

#### Layout
- **Header**: User name, avatar, edit button
- **Sections**:
  - Personal Information
  - Dietary Requirements
  - Location Settings
  - Preferences (Phase 2)

#### Dietary Requirements Selector
- Multi-select interface
- Visual chips for selected items
- Search/filter for long lists
- Save/Cancel actions

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Mobile (< 640px)
- Single column layout
- Full-width components
- Bottom navigation (optional)
- Touch-friendly targets (min 44x44px)
- Swipeable interactions

### Tablet (640px - 1024px)
- 2-column grid where appropriate
- Side panels for filters
- Larger touch targets
- Optimized spacing

### Desktop (> 1024px)
- Multi-column layouts
- Persistent sidebars
- Hover states
- Keyboard navigation emphasis

## Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus indicators visible (2px outline)
- Logical tab order
- Skip links for main content

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels for icons and buttons
- ARIA live regions for dynamic content
- Alt text for images
- Form labels associated with inputs

#### Focus Management
- Focus trap in modals
- Focus return after modal close
- Focus visible on all interactive elements

### ARIA Labels

```tsx
// Example: Restaurant Card
<article
  role="article"
  aria-labelledby="restaurant-name"
  aria-describedby="restaurant-details"
>
  <h3 id="restaurant-name">Restaurant Name</h3>
  <div id="restaurant-details">
    {/* Details */}
  </div>
  <button aria-label="Vote for Restaurant Name">
    Vote
  </button>
</article>
```

## Performance Considerations

### Loading States
- Skeleton screens for content loading
- Progressive image loading
- Lazy loading for below-fold content
- Optimistic UI updates

### Image Optimization
- Next.js Image component
- WebP format with fallbacks
- Responsive image sizes
- Lazy loading

### Code Splitting
- Route-based code splitting (automatic with Next.js)
- Component lazy loading for heavy components
- Dynamic imports for large libraries

### Caching Strategy
- Static page generation where possible
- API response caching
- Browser caching for static assets
- Service worker for offline support (future)

## Animation and Transitions

### Principles
- Subtle and purposeful
- Performance-conscious (60fps target)
- Respect reduced motion preferences

### Transitions
```css
/* Standard transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

### Animations
- **Page Transitions**: Fade in (200ms)
- **Card Hover**: Slight elevation increase
- **Button Press**: Scale down (0.98)
- **Loading**: Skeleton pulse animation
- **Success**: Green checkmark animation

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Error States

### Error Display
- **Inline Errors**: Below form fields
- **Toast Notifications**: For API errors
- **Error Pages**: 404, 500 error pages
- **Empty States**: No results, no groups

### Error Messages
- Clear and actionable
- Avoid technical jargon
- Suggest solutions
- Provide retry options

## Success States

### Feedback
- Success toasts for actions
- Visual confirmation (checkmarks)
- Progress indicators
- Confirmation dialogs for destructive actions

## Future Enhancements (Phase 2+)

### Advanced UI Features
- Map view for restaurants
- Real-time voting visualization
- Restaurant photo galleries
- Weather integration display
- Dark mode support

### Enhanced Interactions
- Swipe gestures on mobile
- Drag and drop for preferences
- Voice input for location
- QR code for group sharing

