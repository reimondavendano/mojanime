'use client';

import { useEffect, useState } from 'react';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

type FeaturedAnime = {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  year: number | string;
  episodes: number | string;
  genre: string;
};

export default function FeaturedSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [featuredContent, setFeaturedContent] = useState<FeaturedAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/anime/feature');
        const data = await res.json();
        setFeaturedContent(data);
      } catch (error) {
        console.error('Failed to fetch featured anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-white">Loading featured anime...</div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Featured This Week
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover the most talked-about anime series and movies that everyone is watching
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {featuredContent.map((item, index) => (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
              activeTab === index ? 'lg:col-span-2 scale-105' : 'hover:scale-105'
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="relative aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={index === 0}
                unoptimized={item.image.startsWith('http')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-purple-600/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="h-8 w-8 text-white fill-current" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-white font-medium">{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{item.year}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{item.episodes} eps</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-purple-400 text-sm font-medium">
                  {item.genre}
                </span>
                <Link href={`/anime/${item.id}`}>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
