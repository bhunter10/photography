# PostgreSQL 17 Setup Guide

## Quick Setup Steps

You've installed PostgreSQL 17. Here's what to do next:

### 1. Start PostgreSQL 17

The official PostgreSQL installer creates a system service. To start it:

**Option A: Using System Preferences (Easiest)**
1. Open **System Preferences** (or **System Settings** on newer macOS)
2. Look for **PostgreSQL 17** in the list
3. Click it and make sure it's running

**Option B: Using Command Line**
```bash
# Check if it's running
sudo -u _postgres /Applications/PostgreSQL\ 17/bin/pg_ctl -D /Library/PostgreSQL/17/data status

# Or try:
/Applications/PostgreSQL\ 17/bin/pg_ctl -D /Library/PostgreSQL/17/data start
```

### 2. Add PostgreSQL 17 to Your PATH

Add this to your `~/.zshrc` file:

```bash
# PostgreSQL 17
export PATH="/Applications/PostgreSQL 17/bin:$PATH"
```

Then reload:
```bash
source ~/.zshrc
```

### 3. Create the Database

Once PostgreSQL 17 is running, create your database:

```bash
# Using full path (if PATH not set up yet)
/Applications/PostgreSQL\ 17/bin/createdb melanie_hunter_photography

# Or if PATH is set up:
createdb melanie_hunter_photography
```

### 4. Update Your DATABASE_URI (if needed)

Your current `.env.local` has:
```
DATABASE_URI=postgresql://localhost/melanie_hunter_photography
```

This should work if PostgreSQL 17 is running on the default port (5432). If you have multiple PostgreSQL versions, you might need to specify the port.

### 5. Test the Connection

```bash
# Using full path
/Applications/PostgreSQL\ 17/bin/psql melanie_hunter_photography

# Or if PATH is set up:
psql melanie_hunter_photography
```

If you see the PostgreSQL prompt (`melanie_hunter_photography=#`), you're connected! Type `\q` to quit.

### 6. Start Your Dev Server

```bash
npm run dev
```

The schema should initialize correctly with PostgreSQL 17! 🎉

### 7. Run the Seed Script

Once the dev server is running, in a separate terminal:

```bash
npm run seed
```

## Troubleshooting

### PostgreSQL 17 Not Starting
- Check System Preferences/Settings for PostgreSQL 17
- Try restarting your Mac
- Check if port 5432 is already in use (by Postgres.app version 18)

### Port Conflicts
If Postgres.app (version 18) is also running, they might conflict. You can:
1. Stop Postgres.app (quit the application)
2. Or use a different port for PostgreSQL 17

### Can't Find psql
Use the full path: `/Applications/PostgreSQL\ 17/bin/psql`

## Next Steps

After PostgreSQL 17 is running and the database is created:
1. ✅ Start dev server: `npm run dev`
2. ✅ Run seed script: `npm run seed`
3. ✅ Visit http://localhost:3000 to see your collections!

