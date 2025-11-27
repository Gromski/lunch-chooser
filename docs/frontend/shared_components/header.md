# Header Component

## Overview
The Header component provides the top-level app header with branding, navigation, and user menu.

## Usage
Used in the root layout, appears on all pages. Contains logo, navigation, and user actions.

## Props/Configuration
```typescript
interface HeaderProps {
  user?: User | null;
  showNavigation?: boolean;
  className?: string;
}
```

## Functionality
- **Primary Function**: Provide app branding and top-level navigation
- **Interactive Elements**: 
  - App logo (links to home)
  - Navigation menu
  - User menu dropdown
  - Login button (if not authenticated)
- **State Management**: Reads from auth context

## Responsive Behavior
- **Mobile**: Compact header, hamburger menu, user avatar
- **Tablet**: Full navigation, user menu
- **Desktop**: Full header with all elements

## Styling
- **CSS Classes**: Tailwind CSS, sticky positioning
- **Theme Integration**: Uses primary color for branding
- **Customization**: Configurable logo and colors

## Accessibility
- **ARIA Support**: `role="banner"`, proper heading structure
- **Keyboard Navigation**: Tab through all interactive elements

## Dependencies
- **External Libraries**: Next.js Image, shadcn/ui DropdownMenu
- **Internal Components**: Navigation, UserMenu

## Testing
- **Test Coverage**: Header rendering, user menu, navigation integration
- **Mock Requirements**: Mock auth context, mock router

