# Restaurant Card Component

## Overview
The RestaurantCard component displays a restaurant's key information in a compact, scannable format for use in lists and grids.

## Usage
Used extensively in restaurant lists, group pages, and search results. Can be configured for different contexts (voting, selection, etc.).

## Props/Configuration
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant;
  showVoteButton?: boolean;
  showDistance?: boolean;
  onClick?: () => void;
  onVote?: () => void;
  className?: string;
}
```

## Functionality
- **Primary Function**: Display restaurant information in card format
- **Interactive Elements**: 
  - Card click (navigate to detail)
  - Vote button (if in group context)
  - Favorite button (future)
- **State Management**: Local hover state, vote state (if applicable)

## Responsive Behavior
- **Mobile**: Full-width card, stacked information
- **Tablet**: 2-column card layout
- **Desktop**: Hover effects, larger cards

## Styling
- **CSS Classes**: Tailwind CSS card styles, hover states
- **Theme Integration**: Uses surface and border colors
- **Customization**: Configurable via props

## Accessibility
- **ARIA Support**: `role="article"`, `aria-label` for restaurant name
- **Keyboard Navigation**: Tab to card, Enter to activate

## Dependencies
- **External Libraries**: Next.js Link, Lucide React icons
- **Internal Components**: Rating display, distance formatter

## Testing
- **Test Coverage**: Card rendering, click handling, vote functionality
- **Mock Requirements**: Mock restaurant data, mock router

