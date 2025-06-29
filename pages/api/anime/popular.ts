// pages/api/anime/popular.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('https://graphql.anilist.co');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = gql`
    query {
      Page(page: 1, perPage: 20) {
        media(sort: POPULARITY_DESC, type: ANIME) {
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
    const data:any = await client.request(query);
    res.status(200).json(data.Page.media);
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    res.status(500).json({ error: 'Failed to fetch popular anime' });
  }
}