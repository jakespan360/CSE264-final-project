import { supabase } from '../supabase.js';

//Backend API service functions for Spotify-related operations
const BASE_URL = 'http://localhost:3000';

const getHeaders = async (isJson = false) => {
  const { data: { session } } = await supabase.auth.getSession();
  const providerToken = session?.provider_token;
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (providerToken) headers['Authorization'] = `Bearer ${providerToken}`;
  return headers;
};

// Legacy client helpers (unused) — backend now owns these Spotify calls.
// export async function getAuthStatus() {
//   const headers = await getHeaders();
//   const res = await fetch(`${BASE_URL}/auth/status`, { headers });
//   const data = await res.json();
//   return data.isAuthenticated;
// }
//
// export async function logout() {
//   const headers = await getHeaders();
//   await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers });
// }
//
// export async function getSpotifyUser() {
//   const res = await fetch(`${BASE_URL}/spotify/me`, {
//     headers: await getHeaders()
//   });
//   if (!res.ok) throw new Error('Failed to fetch user');
//   return res.json();
// }
//
// export async function searchTrack(query) {
//   const encodedQuery = encodeURIComponent(query);
//   try {
//     const res = await fetch(`${BASE_URL}/spotify/search?q=${encodedQuery}&type=track&limit=1`, {
//       headers: await getHeaders()
//     });
//     const data = await res.json();
//     return data.tracks?.items?.[0]?.uri || null;
//   } catch (e) {
//     console.error('Search failed', e);
//     return null;
//   }
// }
//
// export async function createPlaylist(name, description) {
//   const res = await fetch(`${BASE_URL}/spotify/me/playlists`, {
//     method: 'POST',
//     headers: await getHeaders(true),
//     body: JSON.stringify({ name, description, public: true }),
//   });
//
//   if (!res.ok) throw new Error('Failed to create playlist');
//   const data = await res.json();
//   return data.id;
// }
//
// export async function addTracksToPlaylist(playlistId, trackUris) {
//   const chunks = [];
//   for (let i = 0; i < trackUris.length; i += 100) {
//     chunks.push(trackUris.slice(i, i + 100));
//   }
//
//   const headers = await getHeaders(true);
//
//   for (const chunk of chunks) {
//     const res = await fetch(`${BASE_URL}/spotify/playlists/${playlistId}/items`, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify({ uris: chunk }),
//     });
//
//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       console.error('Failed to add tracks to playlist:', errorData);
//       throw new Error(`Failed to add tracks: ${errorData.error?.message || res.statusText}`);
//     }
//   }
// }
//
// export async function savePlaylist(name, uris) {
//   const headers = await getHeaders(true);
//   const res = await fetch(`${BASE_URL}/api/playlists/save`, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify({ name, uris }),
//   });
//   if (!res.ok) throw new Error('Failed to save playlist to Spotify');
//   const data = await res.json();
//   return data.url;
// }

/**
 * Generates a playlist based on a given mood.
 * @param {string} mood - The mood to generate the playlist for.
 * @returns {Promise<string>} The generated playlist's ID.
 * @throws {Error} If the playlist generation fails.
 */
export async function generatePlaylist(mood) {
  const headers = await getHeaders(true);
  const res = await fetch(`${BASE_URL}/api/playlists/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mood }),
  });
  if (!res.ok) throw new Error('Failed to generate playlist');
  const data = await res.json();
  return data.playlist;
}

/**
 * Saves a generated playlist to the user's account.
 * @param {string} name - The name of the playlist.
 * @param {string[]} tracks - An array of Spotify track URIs.
 * @returns {Promise<Object>} The saved playlist data.
 * @throws {Error} If the save fails.
 */
export async function getPlaylistHistory() {
  const res = await fetch(`${BASE_URL}/api/playlists/history`);
  if (!res.ok) throw new Error('Failed to fetch playlist history');
  const data = await res.json();
  return data.playlists;
}

export async function getUserPlaylists() {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}/api/playlists/mine`, { headers });
  if (!res.ok) throw new Error('Failed to fetch your playlists');
  const data = await res.json();
  return data.playlists;
}

export async function saveGeneratedPlaylist(name, tracks) {
  const headers = await getHeaders(true);
  const uris = (tracks || [])
    .map((t) => t?.uri)
    .filter(Boolean);

  const res = await fetch(`${BASE_URL}/api/playlists/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, uris, tracks }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save playlist');
  }

  return data; // { playlistId, url, snapshotIds }
}