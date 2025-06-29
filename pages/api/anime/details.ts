// pages/api/anime/details.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('https://graphql.anilist.co');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const query = gql`
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        coverImage {
          extraLarge
          large
        }
        bannerImage
        genres
        episodes
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        averageScore
        popularity
        studios(isMain: true) {
          nodes {
            name
          }
        }
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  `;

  try {
    const data:any = await client.request(query, { id: Number(id) });
    res.status(200).json(data.Media);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.status(500).json({ error: 'Failed to fetch anime details' });
  }
}