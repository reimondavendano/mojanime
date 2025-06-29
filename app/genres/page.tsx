'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimeCard from '@/components/anime/AnimeCard';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import {
  fetchTrendingAnimeStart,
  fetchTrendingAnimeSuccess,
  fetchTrendingAnimeFailure,
} from '@/redux/features/animeSlice';
import { getTrendingAnime } from '@/lib/api/anilist';
import { Tag } from 'lucide-react';

const popularGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
  'Thriller', 'Mecha', 'Music', 'Psychological'
];

export default function GenresPage() {
  const dispatch = useDispatch();
  const { trendingAnime, loading } = useSelector((state: RootState) => state.anime);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [filteredAnime, setFilteredAnime] = useState(trendingAnime);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchTrendingAnimeStart());
      try {
        const data = await getTrendingAnime();
        dispatch(fetchTrendingAnimeSuccess(data));
      } catch (err) {
        dispatch(fetchTrendingAnimeFailure(err instanceof Error ? err.message : 'Failed to fetch anime'));
      }
    };

    if (trendingAnime.length === 0) {
      fetchData();
    }
  }, [dispatch, trendingAnime.length]);

  useEffect(() => {
    if (selectedGenre === 'All') {
      setFilteredAnime(trendingAnime);
    } else {
      const filtered = trendingAnime.filter(anime => 
        anime.genres?.includes(selectedGenre)
      );
      setFilteredAnime(filtered);
    }
  }, [selectedGenre, trendingAnime]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Tag className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Browse by Genre</h1>
        </div>

        {/* Genre Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedGenre === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedGenre('All')}
              className={`rounded-full ${
                selectedGenre === 'All' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              All Genres
            </Button>
            {popularGenres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full ${
                  selectedGenre === genre 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-700 aspect-[3/4] rounded-xl mb-3"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No anime found for the selected genre.</p>
          </div>
        )}
      </div>
    </div>
  );
}