# Navigation Component

## Overview
The Navigation component provides the main navigation menu for the application, allowing users to move between different sections of the app.

## Usage
Used in the main app layout, appears on all authenticated pages. Can be configured for different user states (authenticated vs. guest).

## Props/Configuration
```typescript
interface NavigationProps {
  user?: User | null;
  currentPath?: string;
  className?: string;
}
```

## Functionality
- **Primary Function**: Provide navigation links to main app sections
- **Interactive Elements**: 
  - Home link
  - Restaurants link
  - Groups link
  - Profile link (if authenticated)
  - Login/Logout button
- **State Management**: Reads from auth context for user state

## Responsive Behavior
- **Mobile**: Hamburger menu, slide-out drawer
- **Tablet**: Horizontal menu with icons
- **Desktop**: Full horizontal menu with labels

## Styling
- **CSS Classes**: Uses Tailwind CSS utility classes
- **Theme Integration**: Follows app color scheme
- **Customization**: Configurable via props and theme

## Accessibility
- **ARIA Support**: `role="navigation"`, `aria-label="Main navigation"`
- **Keyboard Navigation**: Tab through links, Enter to activate

## Dependencies
- **External Libraries**: Next.js Link component
- **Internal Components**: User menu component, Auth context

## Testing
- **Test Coverage**: Navigation rendering, link functionality, user state handling
- **Mock Requirements**: Mock auth context, mock router

