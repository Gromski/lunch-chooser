# Project Structure Documentation

## Overview
This document defines the complete folder structure, file organization patterns, and conventions for the Lunch Decision Tool project.

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

## Root Directory Structure

```
lunch-chooser/
├── .env.local                 # Local environment variables (gitignored)
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore rules
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Node.js dependencies
├── package-lock.json          # Dependency lock file
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   ├── migrations/            # Database migration files
│   └── seed.ts                # Database seed script
├── public/                    # Static assets
│   ├── images/                # Image assets
│   ├── icons/                 # Icon files
│   └── favicon.ico            # Favicon
├── src/                       # Source code
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   └── styles/                # Global styles
├── docs/                      # Documentation
│   ├── implementation.md
│   ├── data_model.md
│   ├── api_specifications.md
│   ├── project_structure.md
│   ├── uiux_doc.md
│   ├── frontend/
│   └── backend/
└── tests/                     # Test files
    ├── unit/
    ├── integration/
    └── e2e/
```

## Source Code Structure (`src/`)

### App Router (`src/app/`)

```
src/app/
├── (auth)/                    # Auth route group
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── register/
│   │   └── page.tsx           # Registration page
│   └── layout.tsx             # Auth layout
├── (main)/                    # Main app route group
│   ├── page.tsx               # Home/Landing page
│   ├── restaurants/
│   │   ├── page.tsx           # Restaurant list page
│   │   └── [id]/
│   │       └── page.tsx       # Restaurant detail page
│   ├── groups/
│   │   ├── page.tsx           # Groups list page
│   │   ├── new/
│   │   │   └── page.tsx       # Create group page
│   │   └── [id]/
│   │       └── page.tsx       # Group detail page
│   ├── profile/
│   │   └── page.tsx           # User profile page
│   └── layout.tsx             # Main app layout
├── api/                       # API routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts       # NextAuth.js handler
│   ├── v1/                    # API v1 routes
│   │   ├── users/
│   │   │   ├── route.ts       # User endpoints
│   │   │   └── [id]/
│   │   │       └── route.ts   # User by ID
│   │   ├── restaurants/
│   │   │   ├── route.ts       # Restaurant endpoints
│   │   │   ├── search/
│   │   │   │   └── route.ts   # Search endpoint
│   │   │   └── [id]/
│   │   │       └── route.ts   # Restaurant by ID
│   │   ├── lunch-groups/
│   │   │   ├── route.ts       # Lunch group endpoints
│   │   │   └── [id]/
│   │   │       ├── route.ts   # Group by ID
│   │   │       ├── participants/
│   │   │       │   └── route.ts
│   │   │       ├── votes/
│   │   │       │   └── route.ts
│   │   │       └── restaurants/
│   │   │           └── route.ts
│   │   ├── votes/
│   │   │   └── route.ts       # Vote endpoints
│   │   └── visits/
│   │       └── route.ts       # Visit history endpoints
│   └── health/
│       └── route.ts           # Health check endpoint
├── globals.css                 # Global CSS styles
├── layout.tsx                 # Root layout
└── error.tsx                  # Error boundary
```

### Components (`src/components/`)

```
src/components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   └── ...
├── layout/                    # Layout components
│   ├── Header.tsx             # App header
│   ├── Navigation.tsx         # Navigation menu
│   ├── Footer.tsx             # App footer
│   └── Sidebar.tsx            # Sidebar (if needed)
├── restaurant/                # Restaurant-related components
│   ├── RestaurantCard.tsx     # Restaurant card display
│   ├── RestaurantList.tsx     # Restaurant list container
│   ├── RestaurantDetail.tsx   # Restaurant detail view
│   └── RestaurantFilters.tsx  # Filter panel
├── group/                     # Lunch group components
│   ├── LunchGroupCard.tsx     # Group card display
│   ├── LunchGroupDetail.tsx   # Group detail view
│   ├── ParticipantList.tsx    # Participant list
│   ├── VoteButton.tsx         # Vote button component
│   └── VoteResults.tsx        # Vote results display
├── location/                  # Location components
│   ├── LocationSelector.tsx   # Location input/select
│   ├── LocationDetector.tsx   # Browser geolocation
│   └── MapView.tsx            # Map display (future)
├── profile/                   # Profile components
│   ├── DietaryRequirementSelector.tsx
│   ├── ProfileForm.tsx
│   └── LocationSettings.tsx
├── forms/                     # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── GroupCreateForm.tsx
│   └── ProfileUpdateForm.tsx
├── shared/                    # Shared utility components
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   ├── EmptyState.tsx
│   ├── Pagination.tsx
│   └── Modal.tsx
└── providers/                 # Context providers
    ├── AuthProvider.tsx
    ├── LocationProvider.tsx
    └── ThemeProvider.tsx
```

### Libraries (`src/lib/`)

```
src/lib/
├── prisma.ts                  # Prisma client instance
├── auth.ts                    # NextAuth.js configuration
├── google-places.ts           # Google Places API client
├── validation.ts              # Zod schemas
└── constants.ts               # App constants
```

### Hooks (`src/hooks/`)

```
src/hooks/
├── useAuth.ts                 # Authentication hook
├── useLocation.ts             # Location detection hook
├── useRestaurants.ts          # Restaurant data hook
├── useLunchGroups.ts          # Lunch group data hook
├── useVotes.ts                # Voting hook
└── useDebounce.ts             # Debounce utility hook
```

### Types (`src/types/`)

```
src/types/
├── user.ts                    # User types
├── restaurant.ts              # Restaurant types
├── lunch-group.ts             # Lunch group types
├── vote.ts                    # Vote types
├── api.ts                     # API response types
└── index.ts                   # Re-export all types
```

### Utils (`src/utils/`)

```
src/utils/
├── distance.ts                # Distance calculation
├── walk-time.ts               # Walk time estimation
├── ranking.ts                 # Restaurant ranking logic
├── filtering.ts               # Filtering utilities
├── formatting.ts              # Data formatting
├── validation.ts              # Form validation
└── errors.ts                  # Error handling utilities
```

### Styles (`src/styles/`)

```
src/styles/
├── globals.css                # Global styles (moved from app/)
└── components.css             # Component-specific styles (if needed)
```

## Configuration Files

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Environment variables exposed to client
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
```

### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
export default config
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## File Naming Conventions

### Components
- **PascalCase** for component files: `RestaurantCard.tsx`
- **PascalCase** for component names: `export const RestaurantCard = () => {}`

### Utilities and Hooks
- **camelCase** with prefix: `useAuth.ts`, `calculateDistance.ts`
- **camelCase** for exports: `export const useAuth = () => {}`

### Types
- **PascalCase** for type files: `user.ts`, `restaurant.ts`
- **PascalCase** for type names: `export type User = {}`

### API Routes
- **lowercase** with hyphens: `route.ts` (Next.js convention)
- Route handlers: `GET`, `POST`, `PATCH`, `DELETE` functions

### Constants
- **UPPER_SNAKE_CASE**: `export const MAX_RADIUS = 5000`

## Import Path Aliases

Configured in `tsconfig.json`:
```typescript
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/types/*": ["./src/types/*"],
    "@/utils/*": ["./src/utils/*"]
  }
}
```

Usage:
```typescript
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/types/user'
```

## Environment Variables

### `.env.local` (Local Development)
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lunch_chooser"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google Places API
GOOGLE_PLACES_API_KEY="your-api-key"

# Optional: OAuth providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### `.env.example` (Template)
```
# Copy this file to .env.local and fill in values
DATABASE_URL=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
GOOGLE_PLACES_API_KEY=""
```

## Database Structure

### Prisma Schema Location
- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`
- **Seed Script**: `prisma/seed.ts`

### Migration Commands
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Testing Structure

```
tests/
├── unit/                      # Unit tests
│   ├── components/
│   ├── utils/
│   └── hooks/
├── integration/               # Integration tests
│   ├── api/
│   └── pages/
└── e2e/                       # End-to-end tests
    ├── flows/
    └── scenarios/
```

## Build and Deployment

### Build Output
- **Output Directory**: `.next/` (Next.js build output)
- **Static Assets**: `public/` (copied to build)
- **Type Definitions**: `.next/types/` (auto-generated)

### Deployment Structure
```
.vercel/                       # Vercel deployment config (if using Vercel)
├── project.json
└── ...
```

## Documentation Structure

```
docs/
├── implementation.md          # Main implementation plan
├── data_model.md              # Database schema documentation
├── api_specifications.md      # API endpoint documentation
├── project_structure.md       # This file
├── uiux_doc.md                # UI/UX specifications
├── frontend/
│   ├── shared_components/
│   │   ├── navigation.md
│   │   ├── header.md
│   │   └── ...
│   └── pages/
│       ├── home.md
│       ├── restaurants.md
│       └── ...
└── backend/
    ├── entities/
    │   ├── user.md
    │   ├── restaurant.md
    │   └── ...
    └── api_endpoints/
        ├── user_endpoints.md
        └── ...
```

## Asset Organization

### Images
- **Location**: `public/images/`
- **Subdirectories**:
  - `public/images/logos/` - Brand logos
  - `public/images/placeholders/` - Placeholder images
  - `public/images/icons/` - Custom icons (if not using icon library)

### Icons
- **Location**: `public/icons/` or use icon library (Lucide React)
- **Format**: SVG preferred

### Fonts
- **Location**: `public/fonts/` (if using custom fonts)
- **Or**: Use Next.js font optimization (`next/font`)

## Code Organization Principles

1. **Co-location**: Keep related files together
2. **Separation of Concerns**: Clear boundaries between UI, logic, and data
3. **Reusability**: Extract common patterns into shared components/utilities
4. **Type Safety**: Use TypeScript strictly, avoid `any`
5. **Consistency**: Follow established patterns throughout codebase

## Module Boundaries

- **App Router**: Handles routing and page composition
- **Components**: Pure UI components, minimal business logic
- **Hooks**: Business logic and data fetching
- **Utils**: Pure functions, no side effects
- **Lib**: External service integrations and configurations
- **API Routes**: Request handling, validation, database operations

## Future Considerations

### Phase 2 Additions
- `src/lib/weather.ts` - Weather API integration
- `src/utils/ranking.ts` - Advanced ranking algorithms
- `src/components/analytics/` - Analytics components

### Phase 3 Additions
- `src/lib/slack.ts` - Slack bot integration
- `src/lib/whatsapp.ts` - WhatsApp integration
- `src/lib/ml/` - Machine learning utilities
- `src/components/integrations/` - Integration components

