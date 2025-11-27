# Filter Panel Component

## Overview
The FilterPanel component provides filtering controls for restaurant searches, including food types, establishment types, distance, and walk time.

## Usage
Used on restaurant list page and group restaurant suggestions. Can be configured as sidebar or bottom sheet.

## Props/Configuration
```typescript
interface FilterPanelProps {
  filters: RestaurantFilters;
  onFiltersChange: (filters: RestaurantFilters) => void;
  availableFoodTypes: FoodType[];
  mode?: 'sidebar' | 'sheet';
  className?: string;
}
```

## Functionality
- **Primary Function**: Allow users to filter restaurant results
- **Interactive Elements**: 
  - Food type checkboxes
  - Establishment type radio buttons/chips
  - Distance slider
  - Walk time slider
  - Clear filters button
- **State Management**: Local filter state, real-time updates

## Responsive Behavior
- **Mobile**: Bottom sheet, full-screen overlay
- **Tablet**: Slide-out panel
- **Desktop**: Persistent sidebar

## Styling
- **CSS Classes**: Tailwind CSS form and panel styles
- **Theme Integration**: Uses surface color for panel
- **Customization**: Configurable layout and filter options

## Accessibility
- **ARIA Support**: Form labels, fieldset/legend for groups
- **Keyboard Navigation**: Tab through controls, arrow keys for sliders

## Dependencies
- **External Libraries**: shadcn/ui Slider, Checkbox components
- **Internal Components**: Button, Modal/Sheet

## Testing
- **Test Coverage**: Filter application, real-time updates, clear functionality
- **Mock Requirements**: Mock filter data, mock change handlers

