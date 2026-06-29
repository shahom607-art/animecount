'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Papa from 'papaparse';
import { WatchStatus } from '@prisma/client';

async function getAuthenticatedUserId() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function exportUserDataJson() {
  const userId = await getAuthenticatedUserId();
  const entries = await prisma.watchEntry.findMany({
    where: { userId },
    include: { anime: true },
  });

  const exportData = entries.map((e) => ({
    animeTitle: e.anime.titleEnglish || e.anime.titleRomaji,
    anilistId: e.anime.anilistId,
    malId: e.anime.malId,
    episodesWatched: e.episodesWatched,
    totalEpisodes: e.anime.episodes,
    duration: e.anime.duration,
    status: e.status,
    rating: e.rating,
    notes: e.notes,
    createdAt: e.createdAt,
  }));

  return JSON.stringify(exportData, null, 2);
}

export async function exportUserDataCsv() {
  const userId = await getAuthenticatedUserId();
  const entries = await prisma.watchEntry.findMany({
    where: { userId },
    include: { anime: true },
  });

  const exportData = entries.map((e) => ({
    Title: e.anime.titleEnglish || e.anime.titleRomaji,
    AniListID: e.anime.anilistId || '',
    MAL_ID: e.anime.malId || '',
    EpisodesWatched: e.episodesWatched,
    TotalEpisodes: e.anime.episodes,
    DurationMins: e.anime.duration,
    Status: e.status,
    Rating: e.rating || '',
    Notes: e.notes || '',
  }));

  return Papa.unparse(exportData);
}

export async function importUserDataJson(jsonString: string) {
  const userId = await getAuthenticatedUserId();
  let parsed: any[];
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Invalid JSON format');
  }

  if (!Array.isArray(parsed)) throw new Error('JSON payload must be an array');

  let importedCount = 0;

  for (const item of parsed) {
    const title = item.animeTitle || item.title || 'Imported Anime';
    const anilistId = item.anilistId ? parseInt(item.anilistId) : null;
    const malId = item.malId ? parseInt(item.malId) : null;

    // Try to match existing anime or create a basic cached record
    let anime = await prisma.anime.findFirst({
      where: {
        OR: [
          ...(anilistId ? [{ anilistId }] : []),
          ...(malId ? [{ malId }] : []),
          { titleRomaji: { equals: title, mode: 'insensitive' } },
        ],
      },
    });

    if (!anime) {
      anime = await prisma.anime.create({
        data: {
          anilistId,
          malId,
          titleRomaji: title,
          episodes: item.totalEpisodes || item.episodes || 12,
          duration: item.duration || 24,
        },
      });
    }

    const statusStr = (item.status || 'WATCHING').toUpperCase();
    const validStatus = Object.values(WatchStatus).includes(statusStr as WatchStatus)
      ? (statusStr as WatchStatus)
      : WatchStatus.WATCHING;

    await prisma.watchEntry.upsert({
      where: { userId_animeId: { userId, animeId: anime.id } },
      update: {
        episodesWatched: item.episodesWatched || 0,
        status: validStatus,
        rating: item.rating ? parseFloat(item.rating) : undefined,
        notes: item.notes || undefined,
      },
      create: {
        userId,
        animeId: anime.id,
        episodesWatched: item.episodesWatched || 0,
        status: validStatus,
        rating: item.rating ? parseFloat(item.rating) : undefined,
        notes: item.notes || undefined,
      },
    });

    importedCount++;
  }

  return { success: true, count: importedCount };
}
