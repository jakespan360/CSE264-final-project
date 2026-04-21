// Make sure this points to your Express server's port
const BASE_URL = 'http://localhost:3000';

/**
 * Checks if the current user is authenticated with Spotify.
 * @returns {Promise<boolean>} True if authenticated, false otherwise.
 */
export async function getAuthStatus() {
  const res = await fetch(`${BASE_URL}/auth/status`);
  const data = await res.json();
  return data.isAuthenticated;
}

/**
 * Logs the current user out of the application.
 * @returns {Promise<void>}
 */
export async function logout() {
  await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
}

/**
 * Fetches the authenticated Spotify user's profile information.
 * @returns {Promise<Object>} The Spotify user profile data.
 * @throws {Error} If the request fails.
 */
export async function getSpotifyUser() {
  const res = await fetch(`${BASE_URL}/spotify/me`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

/**
 * Searches Spotify for a track matching the given query string.
 * @param {string} query - The search term (e.g., song title and artist).
 * @returns {Promise<string|null>} The Spotify track URI if found, or null.
 */
export async function searchTrack(query) {
  const encodedQuery = encodeURIComponent(query);
  try {
    const res = await fetch(`${BASE_URL}/spotify/search?q=${encodedQuery}&type=track&limit=1`);
    const data = await res.json();
    return data.tracks?.items?.[0]?.uri || null;
  } catch (e) {
    console.error('Search failed', e);
    return null;
  }
}

/**
 * Creates a new public playlist on the user's Spotify account.
 * @param {string} userId - The Spotify user ID.
 * @param {string} name - The name of the new playlist.
 * @param {string} description - The description of the new playlist.
 * @returns {Promise<string>} The newly created playlist's ID.
 * @throws {Error} If the playlist creation fails.
 */
export async function createPlaylist(userId, name, description) {
  const res = await fetch(`${BASE_URL}/spotify/me/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, public: true }),
  });
  
  if (!res.ok) throw new Error('Failed to create playlist');
  const data = await res.json();
  return data.id;
}

/**
 * Adds an array of Spotify track URIs to a specified playlist.
 * Automatically chunks requests into batches of 100 to adhere to Spotify API limits.
 * @param {string} playlistId - The ID of the destination playlist.
 * @param {string[]} trackUris - An array of Spotify track URIs to add.
 * @returns {Promise<void>}
 * @throws {Error} If the request to add tracks fails.
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
  // Spotify allows up to 100 tracks per request
  const chunks = [];
  for (let i = 0; i < trackUris.length; i += 100) {
    chunks.push(trackUris.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const res = await fetch(`${BASE_URL}/spotify/playlists/${playlistId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uris: chunk }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Failed to add tracks to playlist:', errorData);
      throw new Error(`Failed to add tracks: ${errorData.error?.message || res.statusText}`);
    }
  }
}