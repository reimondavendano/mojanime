'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimeCard from '@/components/anime/AnimeCard';
import { RootState } from '@/redux/store';
import {
  fetchPopularAnimeStart,
  fetchPopularAnimeSuccess,
  fetchPopularAnimeFailure,
} from '@/redux/features/animeSlice';
import { getPopularAnime } from '@/lib/api/anilist';
import { Star } from 'lucide-react';

export default function PopularPage() {
  const dispatch = useDispatch();
  const { popularAnime, loading, error } = useSelector((state: RootState) => state.anime);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchPopularAnimeStart());
      try {
        const data = await getPopularAnime();
        dispatch(fetchPopularAnimeSuccess(data));
      } catch (err) {
        dispatch(fetchPopularAnimeFailure(err instanceof Error ? err.message : 'Failed to fetch popular anime'));
      }
    };

    if (popularAnime.length === 0) {
      fetchData();
    }
  }, [dispatch, popularAnime.length]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Star className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-white">Most Popular</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-700 aspect-[3/4] rounded-xl mb-3"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl font-semibold mb-2">Error: {error}</p>
          <p>Failed to load popular anime. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Star className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Most Popular</h1>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popularAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </div>
    </div>
  );
}