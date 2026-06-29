'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WatchStatus } from '@prisma/client';
import { updateWatchEntry } from '@/actions/watchActions';

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: {
    id: string;
    episodesWatched: number;
    status: WatchStatus;
    rating: number | null;
    notes: string | null;
    anime: {
      titleEnglish: string | null;
      titleRomaji: string;
      episodes: number;
    };
  } | null;
}

export function QuickEditModal({ isOpen, onClose, entry }: QuickEditModalProps) {
  const [episodesWatched, setEpisodesWatched] = useState(entry?.episodesWatched || 0);
  const [status, setStatus] = useState<WatchStatus>(entry?.status || WatchStatus.WATCHING);
  const [rating, setRating] = useState<number | null>(entry?.rating || null);
  const [notes, setNotes] = useState<string>(entry?.notes || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (entry) {
      setEpisodesWatched(entry.episodesWatched);
      setStatus(entry.status);
      setRating(entry.rating);
      setNotes(entry.notes || '');
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateWatchEntry(entry.id, {
        episodesWatched,
        status,
        rating,
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-zinc-100 truncate pr-4">
              Edit {entry.anime.titleEnglish || entry.anime.titleRomaji}
            </h3>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Progress (Episodes)
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={0}
                  max={entry.anime.episodes || 9999}
                  value={episodesWatched}
                  onChange={(e) => setEpisodesWatched(parseInt(e.target.value) || 0)}
                  className="w-28 text-center font-mono"
                />
                <span className="text-sm text-zinc-500">of {entry.anime.episodes} episodes</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WatchStatus)}
                className="w-full h-11 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                <option value={WatchStatus.WATCHING}>Watching</option>
                <option value={WatchStatus.COMPLETED}>Completed</option>
                <option value={WatchStatus.PLAN_TO_WATCH}>Plan to Watch</option>
                <option value={WatchStatus.DROPPED}>Dropped</option>
                <option value={WatchStatus.REWATCHING}>Rewatching</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Rating (1 - 10)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(rating === num ? null : num)}
                    className={`p-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      rating === num
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your personal thoughts or review..."
                rows={3}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
