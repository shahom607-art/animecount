'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { SearchModal } from '@/features/search/search-modal';
import { QuickEditModal } from '@/features/dashboard/quick-edit-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Plus, Pin, Edit3, Trash2, Play, Check, Clock, Sparkles, Star, Film } from 'lucide-react';
import { WatchStatus } from '@prisma/client';
import { updateWatchEntry, togglePinAnime, deleteWatchEntry, restoreWatchEntry } from '@/actions/watchActions';
import Link from 'next/link';

export function HomeClient({ session, initialEntries, initialStats }: { session: any; initialEntries: any[]; initialStats: any }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedEntryForEdit, setSelectedEntryForEdit] = useState<any>(null);
  const [entries, setEntries] = useState(initialEntries);
  const [lastDeleted, setLastDeleted] = useState<any>(null);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  // Global Ctrl+K listener for Command Palette search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePlusOneEpisode = async (entry: any) => {
    const nextEp = Math.min(entry.episodesWatched + 1, entry.anime.episodes || 9999);
    const isNowCompleted = nextEp >= (entry.anime.episodes || 9999);
    const newStatus = isNowCompleted ? WatchStatus.COMPLETED : entry.status;

    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, episodesWatched: nextEp, status: newStatus } : e))
    );

    try {
      await updateWatchEntry(entry.id, {
        episodesWatched: nextEp,
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (entry: any) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, isPinned: !e.isPinned } : e))
    );
    try {
      await togglePinAnime(entry.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (entry: any) => {
    setLastDeleted(entry);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    try {
      await deleteWatchEntry(entry.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!lastDeleted) return;
    const restored = lastDeleted;
    setLastDeleted(null);
    setEntries((prev) => [restored, ...prev]);
    try {
      await restoreWatchEntry(restored);
    } catch (err) {
      console.error(err);
    }
  };

  const continueWatching = entries.filter((e) => e.status === WatchStatus.WATCHING || e.status === WatchStatus.REWATCHING);
  const recentlyAdded = entries.slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 space-y-20">
        {/* HERO / SEARCH & WATCH TIME COUNTER */}
        <section className="text-center space-y-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              Count every minute.
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-lg mx-auto font-normal">
              Minimal, elegant anime watch time tracking.
            </p>
          </motion.div>

          {/* Search Trigger Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-xl mx-auto"
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900 transition-all shadow-xl cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <SearchIcon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                <span className="text-base font-medium">Search any anime to add...</span>
              </div>
              <kbd className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-zinc-800 text-xs font-mono text-zinc-400 border border-zinc-700/50">
                Press ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* Large Typography Watch Time Summary */}
          {session ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {initialStats.days}
                </div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                  Days Watched
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {initialStats.hours}
                </div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                  Hours Watched
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {initialStats.totalEpisodes}
                </div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                  Episodes
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {initialStats.totalAnime}
                </div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                  Anime Count
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="pt-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-2xl px-8 font-semibold">
                  Start Tracking for Free
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Undo Toast Banner */}
        {lastDeleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm max-w-md mx-auto"
          >
            <span>Removed &quot;{lastDeleted.anime.titleEnglish || lastDeleted.anime.titleRomaji}&quot;</span>
            <Button variant="ghost" size="sm" onClick={handleUndo} className="text-emerald-400 font-semibold">
              Undo
            </Button>
          </motion.div>
        )}

        {/* CONTINUE WATCHING SECTION */}
        {session && continueWatching.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-zinc-400 fill-zinc-400" /> Continue Watching
              </h2>
              <span className="text-xs font-mono text-zinc-500">{continueWatching.length} active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueWatching.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative flex gap-4 p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all hover:shadow-xl"
                >
                  {entry.anime.posterImage ? (
                    <img
                      src={entry.anime.posterImage}
                      alt={entry.anime.titleRomaji}
                      className="w-20 h-28 object-cover rounded-2xl bg-zinc-800 flex-shrink-0 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-28 rounded-2xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Film className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white">
                          {entry.anime.titleEnglish || entry.anime.titleRomaji}
                        </h3>
                        {entry.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-mono">
                        Ep {entry.episodesWatched} of {entry.anime.episodes || '?'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePlusOneEpisode(entry)}
                        className="h-8 px-3 text-xs gap-1 flex-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> +1 Ep
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-zinc-400 hover:text-white"
                        onClick={() => setSelectedEntryForEdit(entry)}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY ADDED SECTION */}
        {session && recentlyAdded.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" /> Recently Added
              </h2>
              <Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">
                View all in Profile →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyAdded.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative flex flex-col p-3 rounded-3xl bg-zinc-900/50 border border-zinc-800/70 hover:border-zinc-700 transition-all overflow-hidden"
                >
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-800 mb-3">
                    {entry.anime.posterImage ? (
                      <img
                        src={entry.anime.posterImage}
                        alt={entry.anime.titleRomaji}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => handleTogglePin(entry)}
                        className={`p-1.5 rounded-xl backdrop-blur-md transition-colors ${
                          entry.isPinned ? 'bg-amber-400 text-zinc-950' : 'bg-black/50 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        className="p-1.5 rounded-xl bg-black/50 text-zinc-400 hover:text-red-400 backdrop-blur-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white">
                    {entry.anime.titleEnglish || entry.anime.titleRomaji}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge variant={entry.status.toLowerCase() as any}>{entry.status.replace(/_/g, ' ')}</Badge>
                    <span className="text-xs text-zinc-500 font-mono">
                      {entry.episodesWatched}/{entry.anime.episodes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <QuickEditModal
        isOpen={!!selectedEntryForEdit}
        onClose={() => setSelectedEntryForEdit(null)}
        entry={selectedEntryForEdit}
      />
    </div>
  );
}
