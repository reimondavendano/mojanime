'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '@/components/home/HeroSection';
import AnimeSection from '@/components/home/AnimeSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import { RootState } from '@/redux/store';
import {
  fetchTrendingAnimeStart,
  fetchTrendingAnimeSuccess,
  fetchTrendingAnimeFailure,
  fetchPopularAnimeStart,
  fetchPopularAnimeSuccess,
  fetchPopularAnimeFailure,
} from '@/redux/features/animeSlice';
import { getTrendingAnime, getPopularAnime } from '@/lib/api/anilist';

export default function HomePage() {
  const dispatch = useDispatch();
  const { trendingAnime, popularAnime, loading } = useSelector((state: RootState) => state.anime);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch trending anime
      dispatch(fetchTrendingAnimeStart());
      try {
        const trending = await getTrendingAnime();
        dispatch(fetchTrendingAnimeSuccess(trending));
      } catch (error) {
        dispatch(fetchTrendingAnimeFailure(error instanceof Error ? error.message : 'Failed to fetch trending anime'));
      }

      // Fetch popular anime
      dispatch(fetchPopularAnimeStart());
      try {
        const popular = await getPopularAnime();
        dispatch(fetchPopularAnimeSuccess(popular));
      } catch (error) {
        dispatch(fetchPopularAnimeFailure(error instanceof Error ? error.message : 'Failed to fetch popular anime'));
      }
    };

    if (trendingAnime.length === 0 || popularAnime.length === 0) {
      fetchData();
    }
  }, [dispatch, trendingAnime.length, popularAnime.length]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
        <FeaturedSection />
        <AnimeSection 
          title="Trending Now" 
          anime={trendingAnime} 
          loading={loading}
          viewAllLink="/trending"
        />
        <AnimeSection 
          title="Most Popular" 
          anime={popularAnime} 
          loading={loading}
          viewAllLink="/popular"
        />
      </div>
    </div>
  );
}