# Switching to PostgreSQL 17

## Current Situation
- ✅ PostgreSQL 17.7 is installed at `/Library/PostgreSQL/17/`
- ❌ Postgres.app (version 18) is still running and handling connections
- 🔄 You need to stop Postgres.app and start PostgreSQL 17

## Steps to Switch

### 1. Stop Postgres.app
1. Quit the **Postgres.app** application (click the icon in your menu bar and quit, or force quit from Activity Monitor)
2. This will stop PostgreSQL 18

### 2. Start PostgreSQL 17 Service

The official PostgreSQL installer runs as a system service. To start it:

**Option A: System Preferences (Easiest)**
1. Open **System Preferences** (or **System Settings** on macOS Ventura+)
2. Look for **PostgreSQL** in the list (it might be under "Other" or search for it)
3. Click it and make sure it's started/running

**Option B: Command Line**
```bash
sudo /Library/PostgreSQL/17/bin/pg_ctl -D /Library/PostgreSQL/17/data start
```

Or if you set up a launchd service:
```bash
sudo launchctl load -w /Library/LaunchDaemons/com.edb.launchd.postgresql-17.plist
```

### 3. Verify PostgreSQL 17 is Running

Test the connection:
```bash
/Library/PostgreSQL/17/bin/psql -U postgres -c "SELECT version();"
```

You should see "PostgreSQL 17.7" (not 18.1).

### 4. Reset Your Database

Once PostgreSQL 17 is running, reset the database:
```bash
/Library/PostgreSQL/17/bin/psql -U postgres -c "DROP DATABASE IF EXISTS melanie_hunter_photography;"
/Library/PostgreSQL/17/bin/psql -U postgres -c "CREATE DATABASE melanie_hunter_photography;"
```

Or if your user has permissions:
```bash
/Library/PostgreSQL/17/bin/dropdb melanie_hunter_photography
/Library/PostgreSQL/17/bin/createdb melanie_hunter_photography
```

### 5. Update DATABASE_URI (if needed)

Your current `.env.local` has:
```
DATABASE_URI=postgresql://localhost/melanie_hunter_photography
```

If PostgreSQL 17 is using a different user or port, you may need:
```
DATABASE_URI=postgresql://postgres@localhost/melanie_hunter_photography
```

Or if you set a password during installation:
```
DATABASE_URI=postgresql://postgres:yourpassword@localhost/melanie_hunter_photography
```

### 6. Test Everything

1. Start dev server: `npm run dev`
2. Should initialize schema without errors!
3. Run seed script: `npm run seed`
4. Visit http://localhost:3000

## Quick Checklist

- [ ] Postgres.app (v18) is quit/stopped
- [ ] PostgreSQL 17 service is running
- [ ] Can connect with `/Library/PostgreSQL/17/bin/psql`
- [ ] Database is created/reset
- [ ] DATABASE_URI is correct
- [ ] Dev server starts without schema errors

## If PostgreSQL 17 Service Won't Start

The official PostgreSQL installer may require you to:
1. Set a password for the `postgres` user during installation
2. Configure the service manually
3. Check logs: `/Library/PostgreSQL/17/data/log/`

You can also use the GUI tools:
- **pgAdmin 4** (in Applications/PostgreSQL 17/)
- **Reload Configuration** (in Applications/PostgreSQL 17/)

