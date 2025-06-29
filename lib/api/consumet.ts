// src/lib/api/consumet.ts
// This file provides client-side functions to interact with anime data.
// It proxies requests through a local Next.js API route to avoid CORS issues,
// and then transforms the data for client consumption.

import axios from 'axios';

// Base URL for your local Next.js API route that will proxy Consumet requests.
const LOCAL_API_PROXY_BASE_URL = '/api/consumet';

// Interface defining the expected structure of anime information from Consumet.
// These types still reflect the *final* data shape you expect from Consumet.
interface ConsumetAnimeInfoResponse {
  id: string; // Consumet's internal ID for the anime
  title: {
    romaji?: string;
    english?: string;
  };
  description: string;
  image: string; // URL for the cover image
  genres: string[];
  status: string;
  totalEpisodes: number;
  rating?: number;
}

// Interface defining the expected structure of an episode detail from Consumet.
interface ConsumetEpisodeDetail {
  id: string; // Consumet's internal ID for the episode
  number: number;
  title: string;
  isFiller: boolean;
}

// Interface for the response containing video sources for an episode.
interface ConsumetEpisodeSourcesResponse {
  sources: Array<{
    url: string; // The video URL (e.g., .mp4, .m3u8)
    quality: string;
    isM3U8: boolean;
  }>;
  download: string;
}

/**
 * Fetches detailed information about an anime from the Consumet API (Zoro.to provider)
 * via a local Next.js API proxy.
 *
 * This function makes a client-side request to your own `/api/consumet/info/:id` route,
 * which then handles the server-side call to the actual Consumet API.
 *
 * @param animeId The ID of the anime to fetch. This ID will be passed to the proxy.
 * @returns A transformed anime object matching your application's expected structure.
 * @throws An error if the API call fails (either the proxy fails or Consumet responds with an error).
 */
export async function getAnimeInfo(animeId: number) {
  try {
    // Make the API call to your local proxy endpoint.
    const response = await axios.get<ConsumetAnimeInfoResponse>(`${LOCAL_API_PROXY_BASE_URL}/info/${animeId}`);

    // Transform the Consumet response data from the proxy to match your application's structure.
    // Ensure these properties match your Redux state's `selectedAnime` structure.
    const transformedData = {
      id: parseInt(response.data.id), // Convert Consumet's string ID to number if needed
      title: {
        romaji: response.data.title?.romaji || response.data.title?.english || 'Unknown Title',
        english: response.data.title?.english || response.data.title?.romaji || 'Unknown Title',
      },
      description: response.data.description,
      coverImage: {
        extraLarge: response.data.image,
        large: response.data.image, // Consumet often provides one image URL, use for both
      },
      genres: response.data.genres,
      status: response.data.status,
      episodes: response.data.totalEpisodes,
      averageScore: response.data.rating,
    };
    return transformedData;
  } catch (error) {
    console.error(`Error fetching anime info for ID ${animeId} via proxy:`, error);
    throw error;
  }
}

/**
 * Fetches episode details and their video sources for a given anime ID from Consumet
 * via a local Next.js API proxy.
 * Currently, it fetches sources for the first episode found.
 *
 * This function makes a client-side request to your own `/api/consumet/info/:id` and
 * then `/api/consumet/watch/:episodeId` routes.
 *
 * @param animeId The Consumet ID of the anime.
 * @returns An array containing episode objects with video URLs.
 * @throws An error if the API call fails.
 */
export async function getAnimeEpisodes(animeId: number) {
  try {
    // First, fetch the anime info (via proxy) to get the list of available episodes with their Consumet IDs.
    const infoResponse = await axios.get<ConsumetAnimeInfoResponse & { episodes: ConsumetEpisodeDetail[] }>(`${LOCAL_API_PROXY_BASE_URL}/info/${animeId}`);
    const episodes = infoResponse.data.episodes;

    if (!episodes || episodes.length === 0) {
      console.warn(`No episodes found for anime ID ${animeId}.`);
      return [];
    }

    // For this example, we will only fetch sources for the first episode.
    const firstEpisode = episodes[0];
    const episodeConsumetId = firstEpisode.id;

    // Fetch the video sources for the specific episode using its Consumet ID via the proxy.
    const sourcesResponse = await axios.get<ConsumetEpisodeSourcesResponse>(`${LOCAL_API_PROXY_BASE_URL}/watch/${episodeConsumetId}`);
    const videoSources = sourcesResponse.data.sources;

    if (!videoSources || videoSources.length === 0) {
      console.warn(`No video sources found for episode ID ${episodeConsumetId}.`);
      return [];
    }

    // Select the best quality source, or the first one if 'auto' is not available.
    const primarySource = videoSources.find(source => source.quality === 'auto') || videoSources[0];

    return [{
      id: firstEpisode.id,
      number: firstEpisode.number,
      title: firstEpisode.title,
      videoUrl: primarySource ? primarySource.url : null,
      isM3U8: primarySource ? primarySource.isM3U8 : false,
    }];
  } catch (error) {
    console.error(`Error fetching episodes/sources for anime ID ${animeId} via proxy:`, error);
    throw error;
  }
}

/**
 * Fetches trending anime data from the Consumet API via the local proxy.
 * @param page The page number (optional).
 * @param perPage The number of items per page (optional).
 * @returns Trending anime data.
 */
export async function getTrendingAnime(page?: number, perPage?: number) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (perPage) params.append('perPage', perPage.toString());

  const response = await axios.get(`${LOCAL_API_PROXY_BASE_URL}/trending`, { params });
  return response.data; // You might need to transform this data for your frontend
}

/**
 * Fetches popular anime data from the Consumet API via the local proxy.
 * @param page The page number (optional).
 * @param perPage The number of items per page (optional).
 * @returns Popular anime data.
 */
export async function getPopularAnime(page?: number, perPage?: number) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (perPage) params.append('perPage', perPage.toString());

  const response = await axios.get(`${LOCAL_API_PROXY_BASE_URL}/popular`, { params });
  return response.data; // You might need to transform this data for your frontend
}
