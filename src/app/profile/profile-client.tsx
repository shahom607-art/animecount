'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, User as UserIcon, Calendar, Star, Film, CheckCircle, Clock, BarChart2, FileText } from 'lucide-react';
import { exportUserDataJson, exportUserDataCsv, importUserDataJson } from '@/actions/importExportActions';

export function ProfileClient({ user, entries, stats }: { user: any; entries: any[]; stats: any }) {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJson = async () => {
    const jsonStr = await exportUserDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anitime-export-${user.name || 'user'}.json`;
    a.click();
  };

  const handleExportCsv = async () => {
    const csvStr = await exportUserDataCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anitime-export-${user.name || 'user'}.csv`;
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportStatus('Importing data...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const res = await importUserDataJson(content);
        setImportStatus(`Successfully imported ${res.count} anime! Refreshing...`);
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: any) {
        setImportStatus(`Import failed: ${err.message}`);
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER PROFILE INFO */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700/50 shadow-xl overflow-hidden flex-shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-extrabold text-white">{user.name || 'Anime Enthusiast'}</h1>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Export / Import buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportJson} className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <label className="inline-flex items-center justify-center rounded-2xl text-xs font-medium border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300 h-8 px-3 cursor-pointer gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" /> Import JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-center text-zinc-300">
            {importStatus}
          </div>
        )}

        {/* DETAILED STATS GRID */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-zinc-400" /> Lifetime Statistics
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Time</div>
              <div className="text-2xl font-bold text-white font-mono">{stats.days} Days</div>
              <div className="text-xs text-zinc-400 mt-1">{stats.hours} Hours ({stats.minutes} mins)</div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Months / Years</div>
              <div className="text-2xl font-bold text-white font-mono">{stats.months} Mos</div>
              <div className="text-xs text-zinc-400 mt-1">{stats.years} Years</div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Average Rating</div>
              <div className="text-2xl font-bold text-amber-400 font-mono flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400" /> {stats.averageRating || 'N/A'}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Based on rated anime</div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Fav Genre / Studio</div>
              <div className="text-base font-bold text-white truncate">{stats.favoriteGenre || 'N/A'}</div>
              <div className="text-xs text-zinc-400 truncate mt-1">{stats.favoriteStudio || 'N/A'}</div>
            </div>
          </div>
        </section>

        {/* ANIME WATCH LIST TABLE */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-zinc-400" /> Watch List ({entries.length})
          </h2>

          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Anime Title</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {entry.anime.posterImage && (
                        <img src={entry.anime.posterImage} alt="" className="w-8 h-10 object-cover rounded-lg bg-zinc-800" />
                      )}
                      <span className="font-medium text-zinc-100">{entry.anime.titleEnglish || entry.anime.titleRomaji}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {entry.episodesWatched} / {entry.anime.episodes} eps
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={entry.status.toLowerCase() as any}>{entry.status.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-amber-400">
                      {entry.rating ? `${entry.rating}/10` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
