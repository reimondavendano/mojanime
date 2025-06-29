// src/app/api/consumet/[...slug]/route.ts
// This Next.js API Route acts as a proxy for the Consumet API.
// It imports server-side fetching logic from the lib folder.

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'; // Still needed for axios.isAxiosError
import { fetchConsumetData, getTrendingAnimeServer, getPopularAnimeServer } from '@/lib/server/consumet-server-fetcher'; // Import server-side fetchers

/**
 * Handles GET requests to the /api/consumet/[...slug] endpoint.
 * It extracts the dynamic path segments from `params.slug` and
 * forwards the request to the Consumet API via a server-side fetcher.
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    // Await params if the environment reports it as a Promise-like object
    // This directly addresses the error "params should be awaited before using its properties."
    const resolvedParams = await params;
    // The 'slug' array will contain all segments after /api/consumet/.
    const apiPath = resolvedParams.slug.join('/'); // Use resolvedParams.slug

    // Extract all query parameters from the incoming request (e.g., ?page=1&perPage=10).
    const queryParams = request.nextUrl.searchParams;

    let data: any;

    // Handle specific top-level paths that map to dedicated server-side functions
    if (apiPath === 'trending') {
      data = await getTrendingAnimeServer(
        parseInt(queryParams.get('page') || '1'),
        parseInt(queryParams.get('perPage') || '10')
      );
    } else if (apiPath === 'popular') {
      data = await getPopularAnimeServer(
        parseInt(queryParams.get('page') || '1'),
        parseInt(queryParams.get('perPage') || '10')
      );
    } else {
      // For all other paths (e.g., info/:id, watch/:episodeId), use the generic fetcher
      data = await fetchConsumetData(apiPath, queryParams);
    }

    // Return the data received from Consumet to the frontend.
    return NextResponse.json(data, { status: 200 }); // Assuming 200 OK if fetchConsumetData succeeds
  } catch (error: any) {
    console.error('Error in API proxy route:', error);

    if (axios.isAxiosError(error) && error.response) {
      // If it's an Axios error with a response from the target API
      console.error('Consumet API responded with error:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    } else {
      // Generic server error (e.g., internal issue, network error from your server)
      return NextResponse.json({ message: 'Internal Server Error', details: error.message || 'Unknown error occurred' }, { status: 500 });
    }
  }
}
