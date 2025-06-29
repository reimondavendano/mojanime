// File: pages/api/anime/featured.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('https://graphql.anilist.co');

const FEATURED_ANIME_QUERY = gql`
  query {
    Page(page: 1, perPage: 3) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        coverImage {
          extraLarge
        }
        startDate {
          year
        }
        episodes
        genres
        averageScore
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data: any = await client.request(FEATURED_ANIME_QUERY);
    console.log('Fetched featured anime:', data); // 🔍 Debug log

    const featured = data.Page.media.map((anime: any) => ({
      id: anime.id,
      title: anime.title.english || anime.title.romaji,
      description: anime.description || 'No description available.',
      image: anime.coverImage.extraLarge,
      rating: (anime.averageScore ?? 0) / 10,
      year: anime.startDate?.year ?? 'N/A',
      episodes: anime.episodes ?? 'N/A',
      genre: anime.genres?.slice(0, 2).join(', ') || 'Unknown',
    }));

    res.status(200).json(featured);
  } catch (error: any) {
    console.error('Error fetching featured anime:', error?.response?.errors || error);
    res.status(500).json({ error: 'Failed to fetch featured anime' });
  }
}