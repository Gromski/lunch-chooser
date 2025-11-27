# Loading Spinner Component

## Overview
The LoadingSpinner component provides visual feedback during data loading and async operations.

## Usage
Used throughout the app for loading states. Can be configured for different sizes and contexts.

## Props/Configuration
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
  className?: string;
}
```

## Functionality
- **Primary Function**: Indicate loading/processing state
- **Interactive Elements**: None (non-interactive)
- **State Management**: None (controlled by parent)

## Responsive Behavior
- Adapts to container size
- Full-screen option for page-level loading

## Styling
- **CSS Classes**: Tailwind CSS animation utilities
- **Theme Integration**: Uses primary color
- **Customization**: Configurable size and color

## Accessibility
- **ARIA Support**: `role="status"`, `aria-label="Loading"`
- **Keyboard Navigation**: N/A (non-interactive)

## Dependencies
- **External Libraries**: Lucide React spinner icon (or custom SVG)
- **Internal Components**: None

## Testing
- **Test Coverage**: Spinner rendering, size variations
- **Mock Requirements**: None

