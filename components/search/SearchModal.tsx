'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnimeCard from '@/components/anime/AnimeCard';
import { RootState } from '@/redux/store';
import { searchAnimeStart, searchAnimeSuccess, searchAnimeFailure, clearSearchResults } from '@/redux/features/animeSlice';
import { searchAnime } from '@/lib/api/anilist';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { searchResults, searchLoading } = useSelector((state: RootState) => state.anime);

  const handleSearch = useCallback(async (searchQuery: string) => {
  if (!searchQuery.trim()) {
      dispatch(clearSearchResults());
      return;
    }

    dispatch(searchAnimeStart());
    try {
      const results = await searchAnime(searchQuery);
      dispatch(searchAnimeSuccess(results));
    } catch (error) {
      dispatch(searchAnimeFailure(error instanceof Error ? error.message : 'Search failed'));
    }
  }, [dispatch]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]); // ✅ fixed missing dep
  
  const handleClose = () => {
    setQuery('');
    dispatch(clearSearchResults());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden p-0 bg-black/90 border-white/20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-lg placeholder:text-gray-500 focus-visible:ring-0"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {searchLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {!searchLoading && searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {searchResults.map((anime) => (
                <div key={anime.id} onClick={handleClose}>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          )}

          {!searchLoading && query && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found for &quot;{query}&quot;</p>
            </div>
          )}

          {!query && (
            <div className="text-center py-8">
              <p className="text-gray-400">Start typing to search for anime...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}