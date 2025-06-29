'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const { trendingAnime } = useSelector((state: RootState) => state.anime);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredAnime = trendingAnime.slice(0, 5);

  useEffect(() => {
    if (!isAutoPlaying || featuredAnime.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredAnime.length, isAutoPlaying]);

  if (featuredAnime.length === 0) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-r from-purple-900/20 to-pink-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentAnime = featuredAnime[currentIndex];
  const title = currentAnime?.title?.english || currentAnime?.title?.romaji || currentAnime?.title?.native || 'Unknown Title';
  const description = currentAnime?.description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...' || 'No description available.';
  const bannerImage = currentAnime?.bannerImage || currentAnime?.coverImage?.extraLarge || currentAnime?.coverImage?.large;

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center space-x-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                #{currentIndex + 1} Trending
              </span>
              {currentAnime?.averageScore && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-white font-medium">{(currentAnime.averageScore / 10).toFixed(1)}</span>
                </div>
              )}
              {currentAnime?.startDate?.year && (
                <div className="flex items-center space-x-1 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{currentAnime.startDate.year}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-lg text-gray-200 mb-6 leading-relaxed">
              {description}
            </p>

            {currentAnime?.genres && (
              <div className="flex flex-wrap gap-2 mb-8">
                {currentAnime.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/anime/${currentAnime?.id}`}>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link href={`/anime/${currentAnime?.id}`}>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold backdrop-blur-sm">
                  <Info className="h-5 w-5 mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-purple-500 scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}