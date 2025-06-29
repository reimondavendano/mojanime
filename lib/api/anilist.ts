import { Anime } from '@/redux/features/animeSlice';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Fetches trending anime from your Next.js API route.
 * @returns {Promise<Anime[]>}
 */
export const getTrendingAnime = async (): Promise<Anime[]> => {
  try {
    const res = await fetch('/api/anime/trending');
    if (!res.ok) throw new Error('Failed to fetch trending anime');
    return await res.json();
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
};

/**
 * Fetches popular anime from your Next.js API route.
 * @returns {Promise<Anime[]>}
 */
export const getPopularAnime = async (): Promise<Anime[]> => {
  try {
    const res = await fetch('/api/anime/popular');
    if (!res.ok) throw new Error('Failed to fetch popular anime');
    return await res.json();
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    throw error;
  }
};

/**
 * Fetches anime details by ID from your API route.
 * @param {number} id - The AniList ID
 * @returns {Promise<Anime>}
 */
export const getAnimeDetails = async (id: number): Promise<Anime> => {
  try {
    const res = await fetch(`/api/anime/details?id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch anime details');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching anime details for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Searches for anime using your API route.
 * @param {string} query - Search keyword
 * @returns {Promise<Anime[]>}
 */
export const searchAnime = async (query: string): Promise<Anime[]> => {
  try {
    const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search anime');
    return await res.json();
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

/**
 * Fetches featured anime from your API route.
 * @returns {Promise<Anime[]>}
 */
export const getFeaturedAnime = async (): Promise<Anime[]> => {
  try {
    const res = await fetch('/api/anime/feature');
    if (!res.ok) throw new Error('Failed to fetch featured anime');
    return await res.json();
  } catch (error) {
    console.error('Error fetching featured anime:', error);
    throw error;
  }
};
