'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Plus, Check, Loader2, Star, Film, Sparkles } from 'lucide-react';
import { searchAnimeAction, getTrendingAnimeAction } from '@/actions/animeActions';
import type { AnimeSearchResult } from '@/services/animeService';
import { addAnimeToWatchList } from '@/actions/watchActions';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchTrending();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const trending = await getTrendingAnimeAction();
      setResults(trending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      fetchTrending();
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAnimeAction(query);
        setResults(data);
        setSelectedIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard Navigation
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      await handleAdd(results[selectedIndex]);
    }
  };

  const handleAdd = async (anime: AnimeSearchResult) => {
    if (!session) {
      router.push('/login');
      onClose();
      return;
    }

    setAddedIds((prev) => new Set(prev).add(anime.id));
    try {
      await addAnimeToWatchList(anime.id);
    } catch (err) {
      console.error('Failed to add anime:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Bar */}
          <div className="relative flex items-center px-5 py-4 border-b border-zinc-800/80">
            <SearchIcon className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type any anime title... (e.g. Naruto, One Piece, Attack on Titan)"
              className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-base font-medium"
            />
            {loading ? (
              <Loader2 className="w-5 h-5 text-zinc-400 animate-spin ml-2" />
            ) : (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
              <span>{query ? 'Search Results' : 'Trending Anime'}</span>
              <span className="text-[11px] font-normal text-zinc-600">Use ↑↓ keys, Enter to add</span>
            </div>

            {results.length === 0 && !loading && (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No anime found matching &quot;{query}&quot;. Try another search.
              </div>
            )}

            {results.map((anime, index) => {
              const isSelected = index === selectedIndex;
              const isAdded = addedIds.has(anime.id);

              return (
                <div
                  key={anime.id}
                  onClick={() => handleAdd(anime)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-800/90 text-white'
                      : 'hover:bg-zinc-800/40 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {anime.posterImage ? (
                      <img
                        src={anime.posterImage}
                        alt={anime.titleRomaji}
                        className="w-12 h-16 object-cover rounded-xl shadow-sm bg-zinc-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Film className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white">
                        {anime.titleEnglish || anime.titleRomaji}
                      </h4>
                      {anime.titleJapanese && (
                        <p className="text-xs text-zinc-400 truncate mt-0.5 font-sans">
                          {anime.titleJapanese}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                        <span>{anime.episodes} eps</span>
                        <span>•</span>
                        <span>{anime.duration || 24}m/ep</span>
                        {anime.averageScore > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-400 font-medium">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {(anime.averageScore / 10).toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(anime);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-100 text-zinc-900 hover:bg-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
