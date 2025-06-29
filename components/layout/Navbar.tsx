'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Play className="h-8 w-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg group-hover:bg-purple-400/30 transition-colors"></div>
              </div>
              <span className="text-2xl font-bold gradient-text">Mojanime</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/trending" className="text-gray-300 hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/popular" className="text-gray-300 hover:text-white transition-colors">
                Popular
              </Link>
              <Link href="/genres" className="text-gray-300 hover:text-white transition-colors">
                Genres
              </Link>
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/trending" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trending
                </Link>
                <Link 
                  href="/popular" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Popular
                </Link>
                <Link 
                  href="/genres" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Genres
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}