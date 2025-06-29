// pages/api/anime/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('https://graphql.anilist.co');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const search = req.query.q as string;

  if (!search) {
    return res.status(400).json({ error: 'Missing search query parameter `q`' });
  }

  const query = gql`
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          episodes
          averageScore
          status
          startDate {
            year
            month
            day
          }
          studios(isMain: true) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const data:any = await client.request(query, { search });
    res.status(200).json(data.Page.media);
  } catch (error) {
    console.error('Error searching anime:', error);
    res.status(500).json({ error: 'Failed to search anime' });
  }
}