# Troubleshooting Guide

## Port Permission Issues (EPERM)

If you're getting `EPERM: operation not permitted` errors when starting the dev server, this is a macOS security restriction.

### Solution 1: Run in Your Terminal (Recommended)
Instead of running through Cursor, open your terminal and run:

```bash
cd /Users/markwright/Documents/Development/CursorProjects/lunch-chooser
npm run dev
```

This should work without permission issues.

### Solution 2: Check macOS Firewall
1. Go to **System Settings** → **Network** → **Firewall**
2. Make sure firewall is not blocking Node.js
3. If needed, add Node.js to allowed applications

### Solution 3: Use a Different Port
If port 3000 is blocked, you can use a different port:

```bash
npm run dev -- -p 3001
```

Or update `package.json`:
```json
"dev": "next dev -p 3001"
```

## Node.js Version Issues

If you see `_semver.default.lt is not a function` errors:
- This happens with Node.js v24+ and older Next.js versions
- Solution: We've updated Next.js to the latest version
- If issues persist, consider using Node.js 20 LTS:
  ```bash
  nvm install 20
  nvm use 20
  ```

## Database Connection Issues

If you see database connection errors:
1. Check `.env.local` has correct `DATABASE_URL`
2. Verify Supabase project is active
3. Test connection with: `npx prisma db pull`

## NextAuth Issues

If authentication isn't working:
1. Verify `NEXTAUTH_SECRET` is set in `.env.local`
2. Make sure it's a secure random string (at least 32 characters)
3. Restart the dev server after changing `.env.local`

## TypeScript Errors

If you see TypeScript compilation errors:
```bash
npm run type-check
```

Fix any errors before running the dev server.

## Common Issues

### "Module not found" errors
```bash
npm install
```

### Port already in use
```bash
# Find what's using the port
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```
