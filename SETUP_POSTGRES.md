# PostgreSQL Setup Guide for macOS

## Option 1: Postgres.app (Recommended - Easiest)

1. **Download Postgres.app**
   - Go to: https://postgresapp.com/
   - Download the latest version
   - Move it to your Applications folder

2. **Start PostgreSQL**
   - Open Postgres.app from Applications
   - Click "Initialize" to create a new server
   - The server will start automatically (you'll see a green indicator)

3. **Configure PATH** (Optional but recommended)
   Add this to your `~/.zshrc` file:
   ```bash
   export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
   ```
   Then run: `source ~/.zshrc`

4. **Create Database**
   ```bash
   createdb melanie_hunter_photography
   ```
   Or using psql:
   ```bash
   psql postgres
   CREATE DATABASE melanie_hunter_photography;
   \q
   ```

5. **Get Connection String**
   - Default connection: `postgresql://localhost/melanie_hunter_photography`
   - Or with user: `postgresql://postgres@localhost/melanie_hunter_photography`

## Option 2: Homebrew

1. **Install Homebrew** (if not installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Follow the on-screen instructions.

2. **Install PostgreSQL**
   ```bash
   brew install postgresql@16
   ```

3. **Start PostgreSQL Service**
   ```bash
   brew services start postgresql@16
   ```

4. **Create Database**
   ```bash
   createdb melanie_hunter_photography
   ```

5. **Connection String**
   - Default: `postgresql://localhost/melanie_hunter_photography`
   - Or: `postgresql://$(whoami)@localhost/melanie_hunter_photography`

## Option 3: Official Installer

1. Go to: https://www.postgresql.org/download/macosx/
2. Download the installer
3. Run the installer and follow the wizard
4. Use the default settings
5. Note the password you set for the postgres user
6. Create database using pgAdmin (included) or command line

## Quick Test

After installation, test your connection:

```bash
psql melanie_hunter_photography
```

If successful, you'll see the PostgreSQL prompt. Type `\q` to quit.

## For This Project

Once PostgreSQL is installed and the database is created, update your `.env` file:

```env
DATABASE_URI=postgresql://localhost/melanie_hunter_photography
```

Or if you set a password:

```env
DATABASE_URI=postgresql://postgres:yourpassword@localhost:5432/melanie_hunter_photography
```

