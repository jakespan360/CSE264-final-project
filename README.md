# CSE264-final-project

## Cmd to run server & client concurrently
```
npx concurrently "npm --prefix server run dev" "npm --prefix client run dev"
```

## Local PostgreSQL Setup

### 1. Install PostgreSQL
If not already installed, use Homebrew:
```
brew install postgresql@15
brew services start postgresql@15
```

### 2. Create the database
```
createdb playlists
```

### 3. Run the migration
```
psql playlists -f server/services/db/migration.sql
```

### 4. Configure the environment variable
In `server/.env`, set:
```
DATABASE_URL=postgresql://localhost:5432/playlists
```

### Resetting the database
If the schema changes, drop and recreate the table:
```
psql playlists -c "DROP TABLE IF EXISTS playlists;"
psql playlists -f server/services/db/migration.sql
```