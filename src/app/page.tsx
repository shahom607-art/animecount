import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getUserStatistics, UserStatsResult } from '@/services/statsService';
import { HomeClient } from './home-client';

export const revalidate = 0;

export default async function HomePage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  let watchEntries: any[] = [];
  let stats: UserStatsResult = {
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

  if (session?.user?.id) {
    watchEntries = await prisma.watchEntry.findMany({
      where: { userId: session.user.id },
      include: { anime: true },
      orderBy: { updatedAt: 'desc' },
    });
    stats = await getUserStatistics(session.user.id);
  }

  return <HomeClient session={session} initialEntries={watchEntries} initialStats={stats} />;
}
