'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import {
  fetchAnimeStart,
  fetchSelectedAnimeSuccess,
  fetchAnimeFailure,
  clearSelectedAnime,
} from '@/redux/features/animeSlice';
import { getAnimeDetails } from '@/lib/api/anilist';
import PlyrPlayer from '@/components/anime/PlyrPlayer';
import AnimeInfo from '@/components/anime/AnimeInfo';
import RelatedAnime from '@/components/anime/RelatedAnime';
import { RootState } from '@/redux/store';

export default function AnimeDetailPage() {
  const params = useParams();
  const idParam = params?.id as string;
  const dispatch = useDispatch();
  const { selectedAnime, loading, error } = useSelector((state: RootState) => state.anime);

  const PLACEHOLDER_VIDEO_URL = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
  const animeId = parseInt(idParam);

  const fetchDetails = useCallback(async () => {
  if (isNaN(animeId)) {
    dispatch(fetchAnimeFailure('Invalid Anime ID provided in the URL.'));
    return;
  }

  dispatch(fetchAnimeStart());
  try {
    const data = await getAnimeDetails(animeId);
    dispatch(fetchSelectedAnimeSuccess(data));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch anime details';
    dispatch(fetchAnimeFailure(errorMessage));
  }
}, [animeId, dispatch]);

useEffect(() => {
  if (!selectedAnime || selectedAnime.id !== animeId) {
    fetchDetails();
  }

  return () => {
    dispatch(clearSelectedAnime());
  };
}, [animeId, dispatch, selectedAnime, fetchDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-white">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-red-400 p-6 rounded-lg shadow-lg bg-gray-800">
          <p className="text-2xl font-semibold mb-4">Error Loading Anime</p>
          <p className="text-lg mb-4">An error occurred while fetching anime details:</p>
          <p className="text-md font-mono bg-red-900/30 p-3 rounded-md border border-red-700">{error}</p>
          <p className="mt-6">Please check the URL or try again later.</p>
        </div>
      </div>
    );
  }

  if (!selectedAnime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-xl text-gray-400">No anime data available.</p>
      </div>
    );
  }

  const trailerId = selectedAnime.trailer?.id;
  const videoUrl = trailerId ? `https://youtu.be/${trailerId}` : PLACEHOLDER_VIDEO_URL;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimeInfo anime={selectedAnime} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Watch Episode 1</h2>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
            <PlyrPlayer
              videoUrl={videoUrl}
              posterUrl={
                selectedAnime.coverImage?.extraLarge || selectedAnime.coverImage?.large
              }
              title={`${selectedAnime.title?.english || selectedAnime.title?.romaji || 'Anime'} Episode 1`}
            />
          </div>
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-red-300 text-sm">
              <strong>Note:</strong> This is a placeholder video for demonstration purposes only.
              Actual anime streaming content is not provided due to copyright restrictions.
            </p>
          </div>
        </section>

        <section>
          <RelatedAnime currentAnimeId={selectedAnime.id} />
        </section>
      </div>
    </div>
  );
}