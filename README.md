# Moodify

## Project Overview

**Moodify** is an AI-powered mood-based playlist generator. Users describe how they're feeling — a vibe, an activity, or a mood — and the app generates a curated 15-song playlist using an AI language model, matches each song on Spotify, and lets the user save it directly to their Spotify account with one click.

The goal is to remove the friction of manually searching for music by turning a natural-language description into a ready-to-go Spotify playlist.

---

## Team Members & Roles

| Name | Role |
|------|------|
| Jacob Spangler (jds327@lehigh.edu)| Backend |
| Andrew Todaro (email)| Full Stack |
| Nathan Ambrosino (email) | UI/UX |

---

## Application Features

### Spotify OAuth Authentication
Users connect their Spotify account via Supabase OAuth. This grants the app permission to read the user's profile and create playlists on their behalf.

### AI Playlist Generation
A mood or vibe entered by the user is sent to the Groq API (using `llama-3.3-70b-versatile`) which returns a JSON array of 15 song recommendations. Each song is then searched on the Spotify API to retrieve its URI, album art, and metadata.

### Save to Spotify
The generated playlist can be saved directly to the user's Spotify account as a new private playlist, viewable immediately in their Spotify library.

### Playlist History
Logged-in users can view all playlists they've previously generated via the History tab. Each entry shows the playlist name, date created, song count, and a link to open it in Spotify.

### Admin Panel
A password-protected admin panel displays all playlists generated across all users, using the same card layout as the History tab. Access requires a password set via environment variable (or "admin" as default")

### PostgreSQL Persistence
Every saved playlist is persisted to a PostgreSQL database on Supabase, storing the playlist name, Spotify URL, song data, and the Spotify user ID of the creator.

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- Supabase project for DB and OAuth
- A Spotify Developer app
- A Gemini API key

### 1. Clone the repository
```
git clone <repo-url>
cd CSE264-final-project
```

### 2. Install dependencies
```
npm --prefix server install
npm --prefix client install
```

### 3. Configure environment variables

Create `server/.env`:
```
DATABASE_URL=your_transaction_pooler_connection_string 
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Create `client/.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=your_admin_password
```

### 4. Set up the database

**Supabase:**
Run the contents of `server/services/db/migration.sql` in the Supabase SQL editor (Dashboard → SQL Editor).
Set `DATABASE_URL` to the Transaction pooler connection string (Settings → Database → Connection pooling → Transaction mode).

### 5. Run the app
```
npx concurrently "npm --prefix server run dev" "npm --prefix client run dev"
```

The client runs at `http://localhost:5173` and the server at `http://localhost:3000`.

---

## API Keys & External Configuration

| Variable | Location | Description |
|----------|----------|-------------|
| `DATABASE_URL` | `server/.env` | PostgreSQL connection string (Supabase Transaction pooler) |
| `GEMINI_API_KEY` | `server/.env` | Gemini API key for AI playlist generation |
| `VITE_SUPABASE_URL` | `client/.env` | Supabase project URL — found in Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `client/.env` | Supabase anon/public key — same location as above |
| `VITE_ADMIN_PASSWORD` | `client/.env` | Password to access the admin panel (defaults to `admin` if not set) |

### Spotify OAuth via Supabase
Spotify login is handled through Supabase Auth. To configure it:
1. Create a Spotify Developer app at [developer.spotify.com](https://developer.spotify.com)
2. Add `https://<your-supabase-project>.supabase.co/auth/v1/callback` as a Redirect URI in the Spotify app settings
3. In Supabase Dashboard → Authentication → Providers → Spotify, enter your Spotify Client ID and Client Secret