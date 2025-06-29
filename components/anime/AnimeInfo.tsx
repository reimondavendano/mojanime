import Image from 'next/image';
import { Star, Calendar, Play, Clock, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Anime } from '@/redux/features/animeSlice';

interface AnimeInfoProps {
  anime: Anime;
}

export default function AnimeInfo({ anime }: AnimeInfoProps) {
  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
  const description = anime.description?.replace(/<[^>]*>/g, '') || 'No description available.';
  const bannerImage = anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large;
  const coverImage = anime.coverImage?.extraLarge || anime.coverImage?.large;

  return (
    <div className="relative">
      {/* Banner Background */}
      <div className="relative h-[60vh] overflow-hidden">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex flex-col lg:flex-row gap-8 items-end">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  {title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {anime.averageScore && (
                    <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  )}
                  
                  {anime.startDate?.year && (
                    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 text-gray-300" />
                      <span className="text-white">{anime.startDate.year}</span>
                    </div>
                  )}
                  
                  {anime.episodes && (
                    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-white">{anime.episodes} Episodes</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 bg-purple-600/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-purple-300 font-medium">
                      {anime.status?.replace(/_/g, ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>

                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre}
                        className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/20"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{genre}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                {description.length > 300 ? description.slice(0, 300) + '...' : description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold">
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Watch Now
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold backdrop-blur-sm">
                  <Users className="h-5 w-5 mr-2" />
                  Add to Watchlist
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                <div>
                  <p className="text-gray-400 text-sm">Studio</p>
                  <p className="text-white font-medium">
                    {anime.studios?.nodes?.[0]?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Episodes</p>
                  <p className="text-white font-medium">{anime.episodes || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-medium">
                    {anime.status?.replace(/_/g, ' ') || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Score</p>
                  <p className="text-white font-medium">
                    {anime.averageScore ? `${anime.averageScore}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}