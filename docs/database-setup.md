# Database Setup Guide

This guide covers setting up the PostgreSQL database for the Lunch Chooser application.

## Prerequisites

- PostgreSQL 15+ installed locally
- PostGIS extension available (required for geospatial queries)

## Local Database Setup

### 1. Install PostgreSQL with PostGIS

**macOS (using Homebrew):**
```bash
brew install postgresql@15 postgis
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql-15 postgresql-15-postgis-3
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
Then install PostGIS extension separately.

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE lunch_chooser;

# Connect to the new database
\c lunch_chooser

# Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

# Exit psql
\q
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/lunch_chooser?schema=public"
```

Replace `your_username` and `your_password` with your PostgreSQL credentials.

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# (Optional) Seed the database with initial data
npm run db:seed
```

### 5. Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

## Production Database Setup

For production, use a managed PostgreSQL service with PostGIS support:

### Recommended Services:
- **Vercel Postgres** (with PostGIS extension)
- **Supabase** (includes PostGIS)
- **AWS RDS with PostGIS**
- **Google Cloud SQL with PostGIS**

### Production Environment Variables

Set these in your hosting platform's environment variable settings:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&sslmode=require"
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key tables include:

- **User** - User accounts and authentication
- **Restaurant** - Cached restaurant data from Google Places API
- **LunchGroup** - Lunch planning sessions
- **Vote** - User votes for restaurants
- **VisitHistory** - Historical visit tracking
- **DietaryRequirement** - Dietary requirement types
- **RestaurantCategory** - Food category types

## Troubleshooting

### PostGIS Extension Not Found

If you get an error about PostGIS extension:

1. Verify PostGIS is installed:
   ```bash
   psql -d lunch_chooser -c "SELECT PostGIS_version();"
   ```

2. Install PostGIS extension manually:
   ```bash
   psql -d lunch_chooser -c "CREATE EXTENSION IF NOT EXISTS postgis;"
   ```

### Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check your connection string format:
   ```
   postgresql://username:password@localhost:5432/database_name
   ```

3. Verify user permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE lunch_chooser TO your_username;
   ```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)



