# Supabase Setup Guide

This guide covers setting up Supabase as the database backend for the Lunch Chooser application.

## Why Supabase?

- **PostgreSQL with PostGIS**: Built-in PostGIS extension for geospatial queries
- **Automatic Backups**: Built-in backup and restore functionality
- **Authentication**: Optional built-in auth (can integrate with NextAuth.js)
- **Real-time**: Real-time subscriptions if needed in the future
- **Free Tier**: Generous free tier for development and small production apps

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Project Name**: `lunch-chooser`
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
5. Click "Create new project"
6. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Connection String

1. Once your project is ready, go to **Settings** > **Database**
2. Scroll down to **Connection string** section
3. Select the **Connection pooling** tab (recommended for serverless)
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

The connection string will look like:
```
postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Database (Supabase Connection Pooling - for Prisma)
DATABASE_URL="postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for migrations only)
DIRECT_DATABASE_URL="postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google Places API
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Optional: Supabase Client (if using Supabase Auth)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Important Notes:

- **Connection Pooling URL**: Use for all Prisma queries (DATABASE_URL)
- **Direct Connection URL**: Use for migrations (DIRECT_DATABASE_URL)
- Replace `[YOUR-PASSWORD]` with your actual database password
- Keep your credentials secure and never commit `.env.local` to Git

## Step 4: Update Prisma Schema

Update `prisma/schema.prisma` to support connection pooling:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

This configuration is needed because Supabase's connection pooler (PgBouncer) doesn't support all Prisma features in transaction mode.

## Step 5: Enable PostGIS Extension

Supabase has PostGIS available, but you may need to enable it:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Run this SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
4. Click **Run**

## Step 6: Run Prisma Migrations

Now you can set up your database schema:

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

## Step 7: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see all your tables (User, Restaurant, LunchGroup, etc.)
3. Or run Prisma Studio locally:
   ```bash
   npm run db:studio
   ```

## Authentication Options

You have two options for authentication:

### Option 1: NextAuth.js (Recommended for this project)
- Already configured in our tech stack
- Flexible provider support
- Easier to customize

### Option 2: Supabase Auth
- Built-in to Supabase
- No additional setup needed
- Can be integrated with NextAuth.js

For this project, we'll use **NextAuth.js** as originally planned, but you can switch to Supabase Auth later if desired.

## Production Configuration

For production deployment:

1. Use the **Connection pooling** URL for `DATABASE_URL`
2. Use the **Direct connection** URL for `DIRECT_DATABASE_URL`
3. Ensure connection strings use SSL: `?sslmode=require`
4. Set up environment variables in your hosting platform (Vercel, etc.)

### Vercel Deployment

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_PLACES_API_KEY`

## Database Management

### Viewing Data
- Use **Table Editor** in Supabase dashboard
- Or use **Prisma Studio**: `npm run db:studio`

### SQL Editor
- Go to **SQL Editor** in Supabase dashboard
- Run custom queries
- Create indexes or run maintenance tasks

### Backups
- Supabase automatically creates daily backups (Pro plan)
- Free tier: Manual backups via SQL dumps

### Monitoring
- Go to **Database** > **Database** in Supabase dashboard
- View connection pooler usage
- Monitor query performance

## Troubleshooting

### Migration Errors

If you get timeout errors during migrations:

1. Make sure you're using `DIRECT_DATABASE_URL` for migrations
2. Check your internet connection
3. Verify your database password is correct
4. Ensure your IP isn't blocked (Supabase allows all IPs by default)

### Connection Pool Exhausted

If you see connection pool errors:

1. Free tier has limited connections (60 concurrent)
2. Use connection pooling URL (`?pgbouncer=true`)
3. Consider upgrading to Pro plan for more connections

### PostGIS Extension Not Found

If PostGIS queries fail:

```sql
-- Run in SQL Editor
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify it's enabled
SELECT PostGIS_version();
```

### Row Level Security (RLS)

Supabase enables RLS by default. For Prisma access:

1. Go to **Authentication** > **Policies**
2. Disable RLS on tables, or
3. Create policies that allow service role access

For development, you can disable RLS on all tables:

```sql
-- Run in SQL Editor for each table
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Restaurant" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "LunchGroup" DISABLE ROW LEVEL SECURITY;
-- ... repeat for all tables
```

**Note**: Only disable RLS if you're handling authorization in your application layer (which we are with NextAuth.js).

## Supabase CLI (Optional)

For advanced users, install Supabase CLI:

```bash
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Pull remote schema
supabase db pull
```

## Cost Considerations

### Free Tier Includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users
- 500 MB edge functions execution time

### When to Upgrade:
- More than 500 MB data
- Need more connections
- Require daily backups
- Need production-level support

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [PostGIS with Supabase](https://supabase.com/docs/guides/database/extensions/postgis)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

