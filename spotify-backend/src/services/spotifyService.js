// src/services/spotifyService.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

let accessToken = null;
let tokenExpirationTime = null;

function isTokenExpired() {
    return !tokenExpirationTime || Date.now() > tokenExpirationTime;
}

async function fetchAccessTokenFromSpotify() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching access token:", errorData);
        throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;

    return accessToken;
}

export async function getSpotifyAccessToken() {
    if (!accessToken || isTokenExpired()) {
        console.log("Requesting new access token from Spotify");
        return await fetchAccessTokenFromSpotify();
    }
    return accessToken;
}

export async function getTrackInfo(trackId) {
    try {
        const token = await getSpotifyAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching track info:", errorData);
            throw new Error("Failed to fetch track info");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getTrackInfo:", error);
        throw error;
    }
}

export async function searchSpotify(query, type = 'track') {
    const token = await getSpotifyAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching search results:", errorData);
        throw new Error("Failed to search on Spotify");
    }

    return await response.json();
}
