// src/lib/server/consumet-server-fetcher.ts
// This file contains server-side functions to directly fetch data from the
// external Consumet API. These functions are intended to be used by Next.js
// API Routes, not directly by client-side components.

import axios from 'axios';

// Base URL for the actual Consumet API endpoint.
const CONSUMET_API_BASE_URL = 'https://api.consumet.org/anime/zoro';

/**
 * Fetches data from the Consumet API for a given path and query parameters.
 * This is a generic server-side function to proxy requests.
 *
 * @param apiPath The path segment for the Consumet API (e.g., 'info/123', 'watch?episodeId=abc').
 * @param queryParams URLSearchParams object containing any query parameters from the original request.
 * @returns The data received from the Consumet API.
 * @throws An AxiosError if the request to Consumet fails.
 */
export async function fetchConsumetData(apiPath: string, queryParams?: URLSearchParams) {
  const targetUrl = `${CONSUMET_API_BASE_URL}/${apiPath}`;

  console.log(`Server-side fetching from Consumet: ${targetUrl}`);

  try {
    const response = await axios.get(targetUrl, {
      params: queryParams, // Pass along query parameters
      // You can add headers here if Consumet API required any specific headers
      // headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    });
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the calling API route.
    throw error;
  }
}

/**
 * Fetches trending anime from the Consumet API.
 * This function is intended for server-side use via a proxy API route.
 *
 * NOTE: Consumet's Zoro.to provider often doesn't have a direct 'trending' endpoint like Anilist.
 * This implementation assumes we're fetching a list of popular or recent releases as a substitute,
 * as these are common ways to approximate 'trending' data from Consumet.
 * You might need to verify the exact path (`popular` or `recent-episodes`) based on Consumet's
 * documentation for the Zoro.to provider.
 *
 * @param page The page number for pagination (optional).
 * @param perPage The number of items per page (optional).
 * @returns An array of trending anime data from Consumet.
 * @throws An AxiosError if the request to Consumet fails.
 */
export async function getTrendingAnimeServer(page?: number, perPage?: number) {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (perPage) queryParams.append('perPage', perPage.toString());

  // Assuming 'popular' endpoint provides a good approximation of trending for Zoro.to.
  // Check Consumet documentation for the most appropriate endpoint.
  const apiPath = `popular`; // Common alternative to 'trending'

  try {
    const trendingData = await fetchConsumetData(apiPath, queryParams);
    // Depending on the Consumet response, you might need to transform this data
    // to match the structure expected by your frontend components (e.g., in RelatedAnime).
    return trendingData;
  } catch (error) {
    console.error('Error fetching trending anime from Consumet server-side:', error);
    throw error;
  }
}

/**
 * Fetches popular anime from the Consumet API.
 * This function is intended for server-side use via a proxy API route.
 *
 * NOTE: This might use the same endpoint as 'trending' if Consumet's Zoro.to provider
 * doesn't differentiate strongly or if 'popular' is the closest available.
 * Always refer to Consumet's official documentation for exact endpoint behavior.
 *
 * @param page The page number for pagination (optional).
 * @param perPage The number of items per page (optional).
 * @returns An array of popular anime data from Consumet.
 * @throws An AxiosError if the request to Consumet fails.
 */
export async function getPopularAnimeServer(page?: number, perPage?: number) {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (perPage) queryParams.append('perPage', perPage.toString());

  // Using the 'popular' endpoint for popular anime.
  const apiPath = `popular`; // Or 'top-airing' if it fits your definition of popular better

  try {
    const popularData = await fetchConsumetData(apiPath, queryParams);
    // You might need to transform this data to match your frontend's expected structure.
    return popularData;
  } catch (error) {
    console.error('Error fetching popular anime from Consumet server-side:', error);
    throw error;
  }
}