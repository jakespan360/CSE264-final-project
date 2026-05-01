# Moodify

## Project Overview

**Moodify** is an AI-powered mood-based playlist generator. Users describe how they're feeling — a vibe, an activity, or a mood — and the app generates a curated 15-song playlist using an AI language model, matches each song on Spotify, and lets the user save it directly to their Spotify account with one click.

The goal is to remove the friction of manually searching for music by turning a natural-language description into a ready-to-go Spotify playlist.

---

## Team Members & Roles

| Name | Role |
|------|------|
| Jacob Spangler (jds327@lehigh.edu)| Backend |
| Andrew Todaro (apt226@lehigh.edu)| Full Stack |
| Nathan Ambrosino (nca227@lehigh.edu) | UI/UX |

---

## Application Features

### Spotify OAuth Authentication
Users connect their Spotify account via Supabase OAuth. This grants the app permission to read the user's profile and create playlists on their behalf.

### AI Playlist Generation
A mood or vibe entered by the user is sent to the Gemini API (using the model gemini-3-flash-preview) which returns a JSON array of 15 song recommendations. Each song is then searched on the Spotify API to retrieve its URI, album art, and metadata.

### Save to Spotify
The generated playlist can be saved directly to the user's Spotify account as a new private playlist, viewable immediately in their Spotify library.

### Playlist History
Logged-in users can view all playlists they've previously generated via the History tab. Each entry shows the playlist name, date created, song count, and a link to open it in Spotify.

### Admin Panel
A password-protected admin panel displays all playlists generated across all users, using the same card layout as the History tab. Access requires a password set via environment variable (or "admin" as default"), password is admin for admin access.

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
### 3. Create environment variable files
 
Create `server/.env`
Create `client/.env`

### 4. Create  & Setup Supabase instance 
- Navigate to https://supabase.com/ create a new project instance
- Go to the project overview page, top of left side bar, where the name of the project is listed there will be a dropdown to copy. Copy the project url and publishable key to the client/.env file with the variable name below they should look like this:
    - VITE_SUPABASE_URL="your_key"
    - VITE_SUPABASE_ANON_KEY="your_key"
- Click Connect button while inside Supabase project
- Install packages as shown in instructions inside terminal
- Add the follow to your server/.env file
    NEXT_PUBLIC_SUPABASE_URL="your key"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your key"

### 5. Create Spotify Developer App
- go to https://developer.spotify.com/ login to your spotify account and hit create app
- make sure Web API is checked so that the correct routes can be used
- you will need the client id and client secret to connect Supabase & Spotify
- Also click on the User Management tab in the spotify developer and add your name and spotify account email so that your account has permissions to the app

### 6. Link Spotify & Supabase
- Navigate to your Supabase project instance, go to the authentication page on the left sidebar
- click sign in/providers, turn off confirm email
- scroll down through auth providers to the Spotify Auth provider
- Enable the Spotify connector, and copy and paste the client id and client secret you got from the spotify developer dashboard to this connector
- lastly copy and paste the callback url for OAuth on this page back to your spotify developer dashboard under the Redirect URIs location.

### 7. Create Google AI Studio Application 
- Navigate to Google AI Studio https://aistudio.google.com/ and create a new project and an API key
- After creating a new project and key go to the API keys tab, under the "key" column click the link that is displayed by your project and copy the API key to server/.env
- it should look like this: GEMINI_API_KEY="your_key"

### 8. Set Up the Database

Navigate to your Supabase project dashboard, open the SQL Editor from the left sidebar, and run the contents of `server/services/db/migration.sql`. This will create all required tables.

Next, get your database connection string: go to **Settings → Database → Connection pooling** and copy the **Transaction mode** connection string. Add it to `server/.env` as `DATABASE_URL`.

---

### 9. Validate Environment Files

Confirm your environment files match the following before running the app.

`client/.env`:
```env
VITE_SUPABASE_URL="your_key"
VITE_SUPABASE_ANON_KEY="your_key"
VITE_ADMIN_PASSWORD="your_admin_password" (optional, default = "admin")
```

`server/.env`:
```env
DATABASE_URL="your_transaction_pooler_connection_string"
GEMINI_API_KEY="your_key"
NEXT_PUBLIC_SUPABASE_URL="your_key"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_key"
```

---

### 10. Run the App

```bash
npx concurrently "npm --prefix server run dev" "npm --prefix client run dev"
```

The client runs at `http://localhost:5173` and the server at `http://localhost:3000`.

---

## API Keys & External Configuration

| Variable | Location | Description |
|----------|----------|-------------|
| `DATABASE_URL` | `server/.env` | PostgreSQL connection string (Supabase Transaction pooler) |
| `GEMINI_API_KEY` | `server/.env` | Gemini API key for AI playlist generation |
| `NEXT_PUBLIC_SUPABASE_URL` | `server/.env` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `server/.env` | Supabase publishable key |
| `VITE_SUPABASE_URL` | `client/.env` | Supabase project URL — found in Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `client/.env` | Supabase anon/public key — same location as above |
| `VITE_ADMIN_PASSWORD` | `client/.env` | Password to access the admin panel (defaults to `admin` if not set) |

### Spotify OAuth via Supabase

Spotify login is handled through Supabase Auth. To configure it:

1. Create a Spotify Developer app at [developer.spotify.com](https://developer.spotify.com)
2. Add `https://<your-supabase-project>.supabase.co/auth/v1/callback` as a Redirect URI in the Spotify app settings
3. In Supabase Dashboard → **Authentication → Providers → Spotify**, enter your Spotify Client ID and Client Secret