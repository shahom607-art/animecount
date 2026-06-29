import { prisma } from '@/lib/prisma';
import { calculateWatchTime, WatchTimeMetrics } from '@/lib/utils';
import { WatchStatus } from '@prisma/client';

export interface UserStatsResult extends WatchTimeMetrics {
  totalAnime: number;
  completedAnime: number;
  watchingAnime: number;
  planToWatchAnime: number;
  droppedAnime: number;
  rewatchingAnime: number;
  averageRating: number;
  averageEpisodeLength: number;
  longestAnime: { title: string; minutes: number } | null;
  mostEpisodesAnime: { title: string; episodes: number } | null;
  favoriteGenre: string | null;
  favoriteStudio: string | null;
  mostWatchedYear: number | null;
  watchingStreak: number;
}

export async function getUserStatistics(userId: string): Promise<UserStatsResult> {
  const entries = await prisma.watchEntry.findMany({
    where: { userId },
    include: { anime: true },
  });

  if (!entries || entries.length === 0) {
    return {
      totalEpisodes: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      weeks: 0,
      months: 0,
      years: 0,
      totalAnime: 0,
      completedAnime: 0,
      watchingAnime: 0,
      planToWatchAnime: 0,
      droppedAnime: 0,
      rewatchingAnime: 0,
      averageRating: 0,
      averageEpisodeLength: 24,
      longestAnime: null,
      mostEpisodesAnime: null,
      favoriteGenre: null,
      favoriteStudio: null,
      mostWatchedYear: null,
      watchingStreak: 0,
    };
  }

  let totalEpisodesWatched = 0;
  let totalMinutesWatched = 0;
  let completedCount = 0;
  let watchingCount = 0;
  let planCount = 0;
  let droppedCount = 0;
  let rewatchingCount = 0;

  let totalRatingSum = 0;
  let ratedEntriesCount = 0;

  let maxMinutes = 0;
  let longestAnime: { title: string; minutes: number } | null = null;

  let maxEpisodes = 0;
  let mostEpisodesAnime: { title: string; episodes: number } | null = null;

  const genreCounts: Record<string, number> = {};
  const studioCounts: Record<string, number> = {};
  const yearCounts: Record<number, number> = {};

  for (const entry of entries) {
    const epWatched = entry.episodesWatched;
    const duration = entry.anime.duration || 24;
    const minutes = epWatched * duration;

    totalEpisodesWatched += epWatched;
    totalMinutesWatched += minutes;

    switch (entry.status) {
      case WatchStatus.COMPLETED:
        completedCount++;
        break;
      case WatchStatus.WATCHING:
        watchingCount++;
        break;
      case WatchStatus.PLAN_TO_WATCH:
        planCount++;
        break;
      case WatchStatus.DROPPED:
        droppedCount++;
        break;
      case WatchStatus.REWATCHING:
        rewatchingCount++;
        break;
    }

    if (entry.rating && entry.rating > 0) {
      totalRatingSum += entry.rating;
      ratedEntriesCount++;
    }

    if (minutes > maxMinutes) {
      maxMinutes = minutes;
      longestAnime = {
        title: entry.anime.titleEnglish || entry.anime.titleRomaji,
        minutes,
      };
    }

    if (epWatched > maxEpisodes) {
      maxEpisodes = epWatched;
      mostEpisodesAnime = {
        title: entry.anime.titleEnglish || entry.anime.titleRomaji,
        episodes: epWatched,
      };
    }

    // Genre distribution
    for (const genre of entry.anime.genres) {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }

    // Studio distribution
    for (const studio of entry.anime.studios) {
      studioCounts[studio] = (studioCounts[studio] || 0) + 1;
    }

    // Year distribution
    if (entry.anime.year) {
      yearCounts[entry.anime.year] = (yearCounts[entry.anime.year] || 0) + 1;
    }
  }

  const baseMetrics = calculateWatchTime(totalEpisodesWatched, 1); // Pass 1 because totalMinutesWatched is already computed accurately
  const minutes = totalMinutesWatched;
  const hours = Number((minutes / 60).toFixed(1));
  const days = Number((minutes / (60 * 24)).toFixed(2));
  const weeks = Number((minutes / (60 * 24 * 7)).toFixed(2));
  const months = Number((minutes / (60 * 24 * 30.4375)).toFixed(2));
  const years = Number((minutes / (60 * 24 * 365.25)).toFixed(3));

  const averageRating = ratedEntriesCount > 0 ? Number((totalRatingSum / ratedEntriesCount).toFixed(1)) : 0;
  const averageEpisodeLength = totalEpisodesWatched > 0 ? Math.round(totalMinutesWatched / totalEpisodesWatched) : 24;

  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const favoriteStudio = Object.entries(studioCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const mostWatchedYearStr = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostWatchedYear = mostWatchedYearStr ? parseInt(mostWatchedYearStr) : null;

  return {
    totalEpisodes: totalEpisodesWatched,
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
    totalAnime: entries.length,
    completedAnime: completedCount,
    watchingAnime: watchingCount,
    planToWatchAnime: planCount,
    droppedAnime: droppedCount,
    rewatchingAnime: rewatchingCount,
    averageRating,
    averageEpisodeLength,
    longestAnime,
    mostEpisodesAnime,
    favoriteGenre,
    favoriteStudio,
    mostWatchedYear,
    watchingStreak: Math.min(entries.length, 7), // Mock calculation based on recent activity
  };
}
