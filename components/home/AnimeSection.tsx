import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import AnimeCard from '@/components/anime/AnimeCard';
import { Anime } from '@/redux/features/animeSlice';

interface AnimeSectionProps {
  title: string;
  anime: Anime[];
  loading?: boolean;
  viewAllLink?: string;
}

export default function AnimeSection({ title, anime, loading = false, viewAllLink }: AnimeSectionProps) {
  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span className="mr-1">View All</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.slice(0, 12).map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
    </section>
  );
}