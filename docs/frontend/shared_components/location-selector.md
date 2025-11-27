# Location Selector Component

## Overview
The LocationSelector component allows users to set or update their location for restaurant searches, either by detecting current location or entering an address.

## Usage
Used on home page, profile page, and group creation. Can be configured as inline or modal.

## Props/Configuration
```typescript
interface LocationSelectorProps {
  initialLocation?: Location;
  onLocationChange: (location: Location) => void;
  mode?: 'inline' | 'modal';
  showDefaultOption?: boolean;
  className?: string;
}
```

## Functionality
- **Primary Function**: Allow users to set location for restaurant searches
- **Interactive Elements**: 
  - "Use current location" button
  - Address input with autocomplete
  - Map picker (future)
  - Save as default checkbox
- **State Management**: Local form state, geolocation state

## Responsive Behavior
- **Mobile**: Full-screen modal, bottom sheet
- **Tablet**: Centered modal
- **Desktop**: Inline or modal, larger map view

## Styling
- **CSS Classes**: Tailwind CSS form styles
- **Theme Integration**: Uses primary color for actions
- **Customization**: Configurable layout and styling

## Accessibility
- **ARIA Support**: Form labels, error announcements
- **Keyboard Navigation**: Tab through form, Enter to submit

## Dependencies
- **External Libraries**: Google Places Autocomplete (future)
- **Internal Components**: Button, Input, Modal

## Testing
- **Test Coverage**: Location detection, address input, form submission
- **Mock Requirements**: Mock geolocation API, mock Places API

