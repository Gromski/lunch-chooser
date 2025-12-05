# Quick Setup Guide

This is a quick reference for setting up the Lunch Chooser application.

## Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier is fine)
- Google Cloud Platform account (for Places API)

## Setup Steps

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase Database

Follow the detailed guide: [docs/supabase-setup.md](docs/supabase-setup.md)

**Quick steps:**
1. Create a project at [supabase.com](https://supabase.com/)
2. Get your connection strings from Settings > Database
3. Enable PostGIS extension in SQL Editor

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual credentials:
- Supabase DATABASE_URL and DIRECT_DATABASE_URL
- NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)
- GOOGLE_PLACES_API_KEY (see step 4)

### 4. Set Up Google Places API

Follow the detailed guide: [docs/google-places-api-setup.md](docs/google-places-api-setup.md)

**Quick steps:**
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Places API (New)"
3. Create API Key
4. Add to `.env.local`

### 5. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verify Setup

- ✅ App loads at http://localhost:3000
- ✅ No console errors
- ✅ Prisma Studio works: `npm run db:studio`
- ✅ Database tables visible in Supabase dashboard

## Common Issues

### Migration fails
- Check your DIRECT_DATABASE_URL is correct
- Ensure PostGIS extension is enabled
- Verify internet connection

### Connection errors
- Use connection pooling URL (with `?pgbouncer=true`) for DATABASE_URL
- Use direct connection URL (port 5432) for DIRECT_DATABASE_URL

### RLS (Row Level Security) issues
- Disable RLS on tables if using Prisma (see supabase-setup.md)

## Next Steps

Once setup is complete, you're ready to continue with:
- **Stage 2**: Core Backend & Data Layer
- **Stage 3**: Frontend Foundation
- **Stage 4**: Core Pages & Features

## Documentation

- [Database Setup (Supabase)](docs/supabase-setup.md)
- [Local PostgreSQL Setup](docs/database-setup.md) *(alternative)*
- [Google Places API Setup](docs/google-places-api-setup.md)
- [Implementation Plan](docs/implementation.md)
- [Project Structure](docs/project_structure.md)

## Need Help?

Check the detailed documentation in the `docs/` folder for troubleshooting and advanced configuration.

