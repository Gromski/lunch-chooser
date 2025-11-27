# Error Message Component

## Overview
The ErrorMessage component displays error information to users in a consistent, accessible format.

## Usage
Used throughout the app for error states. Can be configured for different error types and contexts.

## Props/Configuration
```typescript
interface ErrorMessageProps {
  error: Error | string;
  title?: string;
  onRetry?: () => void;
  variant?: 'inline' | 'toast' | 'page';
  className?: string;
}
```

## Functionality
- **Primary Function**: Display error information to users
- **Interactive Elements**: 
  - Retry button (if provided)
  - Dismiss button (for toasts)
- **State Management**: None (controlled by parent)

## Responsive Behavior
- Adapts to container
- Full-width for page-level errors
- Toast positioning for notifications

## Styling
- **CSS Classes**: Tailwind CSS error styles
- **Theme Integration**: Uses error color from theme
- **Customization**: Configurable variant and styling

## Accessibility
- **ARIA Support**: `role="alert"`, `aria-live="assertive"`
- **Keyboard Navigation**: Tab to retry button, Enter to activate

## Dependencies
- **External Libraries**: Lucide React error icon
- **Internal Components**: Button

## Testing
- **Test Coverage**: Error display, retry functionality, variants
- **Mock Requirements**: Mock error objects

