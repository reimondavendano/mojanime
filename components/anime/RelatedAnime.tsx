'use client';

import { useEffect, useState } from 'react';
import AnimeCard from './AnimeCard';
import { getTrendingAnime } from '@/lib/api/anilist';
import { Anime } from '@/redux/features/animeSlice';

interface RelatedAnimeProps {
  currentAnimeId: number;
}

export default function RelatedAnime({ currentAnimeId }: RelatedAnimeProps) {
  const [relatedAnime, setRelatedAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const trending = await getTrendingAnime();
        // Filter out current anime and get random selection
        const filtered = trending.filter(anime => anime.id !== currentAnimeId);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedAnime(shuffled.slice(0, 12));
      } catch (error) {
        console.error('Error fetching related anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentAnimeId]);

  if (loading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">You Might Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 aspect-[3/4] rounded-xl mb-3"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {relatedAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
}