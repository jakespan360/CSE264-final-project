const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export async function searchTrack(query, accessToken) {
  const res = await fetch(
    `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.tracks.items[0] || null;
}

export async function getSpotifyProfile(accessToken) {
  const res = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}

export async function createPlaylist(userId, name, accessToken) {
  const res = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, public: false }),
  });
  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}

export async function addTracksToPlaylist(playlistId, uris, accessToken) {
  const res = await fetch(
    `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    },
  );
  if (!res.ok) throw new Error("Failed to add tracks");
  return res.json();
}
