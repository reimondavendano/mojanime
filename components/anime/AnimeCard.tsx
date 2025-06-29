import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Play } from 'lucide-react';
import { Anime } from '@/redux/features/animeSlice';

interface AnimeCardProps {
  anime: Anime;
  showDetails?: boolean;
}

export default function AnimeCard({ anime, showDetails = true }: AnimeCardProps) {
  if (!anime) return null;

  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
  const coverImage = anime.coverImage?.large || anime.coverImage?.extraLarge || 'https://placehold.co/250x350/2D3748/EDF2F7?text=No+Image';
  const year = anime.startDate?.year;
  const score = anime.averageScore;

  console.log(anime);

  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-card border border-white/10 anime-card-hover">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-purple-600 hover:bg-purple-700 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 text-white fill-current" />
            </div>
          </div>

          {/* Score Badge */}
          {score && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white font-medium">{(score / 10).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors duration-200 mb-2">
            {title}
          </h3>
          
          {showDetails && (
            <div className="space-y-2">
              {year && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{year}</span>
                </div>
              )}
              
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                  {anime.genres.length > 2 && (
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                      +{anime.genres.length - 2}
                    </span>
                  )}
                </div>
              )}
              
              {anime.episodes && (
                <p className="text-gray-400 text-sm">
                  {anime.episodes} Episodes
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}