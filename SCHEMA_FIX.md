# Database Schema Issue Fix

## Problem
You're experiencing `column "id" is in a primary key` errors when Payload tries to push schema changes.

## Root Cause
You're using **PostgreSQL 18.1**, which has known compatibility issues with Payload CMS 3.9.0's schema migration system. This is a known issue reported in the Payload GitHub repository.

## Solutions

### Option 1: Downgrade PostgreSQL (Recommended)
1. **Backup your data** (if any)
2. **Install PostgreSQL 17** instead of 18:
   ```bash
   # If using Homebrew:
   brew uninstall postgresql@18
   brew install postgresql@17
   
   # Or download PostgreSQL 17 from:
   # https://www.postgresql.org/download/macosx/
   ```
3. **Recreate the database**:
   ```bash
   /Applications/Postgres.app/Contents/Versions/17/bin/psql postgres -c "DROP DATABASE IF EXISTS melanie_hunter_photography;"
   /Applications/Postgres.app/Contents/Versions/17/bin/psql postgres -c "CREATE DATABASE melanie_hunter_photography;"
   ```
4. **Update your DATABASE_URI** if needed
5. **Restart the dev server**

### Option 2: Use Manual Migrations
If you prefer to stick with PostgreSQL 18, you may need to:
1. Wait for Payload CMS to release a fix for PostgreSQL 18
2. Use manual SQL migrations instead of auto-push
3. Monitor: https://github.com/payloadcms/payload/issues/13963

### Option 3: Reset Database Fresh
Sometimes a clean reset helps:
```bash
# Stop all connections
/Applications/Postgres.app/Contents/Versions/latest/bin/psql postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'melanie_hunter_photography' AND pid <> pg_backend_pid();"

# Drop and recreate
/Applications/Postgres.app/Contents/Versions/latest/bin/psql postgres -c "DROP DATABASE IF EXISTS melanie_hunter_photography;"
/Applications/Postgres.app/Contents/Versions/latest/bin/psql postgres -c "CREATE DATABASE melanie_hunter_photography;"

# Restart dev server and let it initialize fresh
npm run dev
```

## Current Status
- **PostgreSQL Version**: 18.1
- **Payload Version**: 3.9.0
- **Issue**: Schema migration conflicts with PostgreSQL 18

## Recommended Action
**Downgrade to PostgreSQL 17** - This is the most reliable solution for now.

