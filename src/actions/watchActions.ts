'use me'; // Server Action directive handled at top level or function level

'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { WatchStatus } from '@prisma/client';

async function getAuthenticatedUserId() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function addAnimeToWatchList(animeId: string, initialStatus: WatchStatus = WatchStatus.WATCHING) {
  const userId = await getAuthenticatedUserId();

  const anime = await prisma.anime.findUnique({ where: { id: animeId } });
  if (!anime) throw new Error('Anime not found');

  const existing = await prisma.watchEntry.findUnique({
    where: { userId_animeId: { userId, animeId } },
  });

  if (existing) {
    return existing;
  }

  const newEntry = await prisma.watchEntry.create({
    data: {
      userId,
      animeId,
      episodesWatched: initialStatus === WatchStatus.COMPLETED ? anime.episodes : 1,
      status: initialStatus,
    },
  });

  revalidatePath('/');
  revalidatePath('/profile');
  return newEntry;
}

export async function updateWatchEntry(
  entryId: string,
  data: {
    episodesWatched?: number;
    status?: WatchStatus;
    rating?: number | null;
    notes?: string | null;
    isPinned?: boolean;
  }
) {
  const userId = await getAuthenticatedUserId();

  const entry = await prisma.watchEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.userId !== userId) {
    throw new Error('Unauthorized or entry not found');
  }

  const updated = await prisma.watchEntry.update({
    where: { id: entryId },
    data,
  });

  revalidatePath('/');
  revalidatePath('/profile');
  return updated;
}

export async function togglePinAnime(entryId: string) {
  const userId = await getAuthenticatedUserId();
  const entry = await prisma.watchEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) throw new Error('Unauthorized');

  const updated = await prisma.watchEntry.update({
    where: { id: entryId },
    data: { isPinned: !entry.isPinned },
  });

  revalidatePath('/');
  return updated;
}

export async function deleteWatchEntry(entryId: string) {
  const userId = await getAuthenticatedUserId();
  const entry = await prisma.watchEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) throw new Error('Unauthorized');

  await prisma.watchEntry.delete({ where: { id: entryId } });

  revalidatePath('/');
  revalidatePath('/profile');
  return { success: true, deletedEntry: entry };
}

export async function restoreWatchEntry(entryData: any) {
  const userId = await getAuthenticatedUserId();
  const restored = await prisma.watchEntry.create({
    data: {
      id: entryData.id,
      userId,
      animeId: entryData.animeId,
      episodesWatched: entryData.episodesWatched,
      status: entryData.status,
      rating: entryData.rating,
      notes: entryData.notes,
      isPinned: entryData.isPinned,
    },
  });
  revalidatePath('/');
  revalidatePath('/profile');
  return restored;
}

export async function bulkUpdateEntries(entryIds: string[], status: WatchStatus) {
  const userId = await getAuthenticatedUserId();

  await prisma.watchEntry.updateMany({
    where: {
      id: { in: entryIds },
      userId,
    },
    data: { status },
  });

  revalidatePath('/');
  revalidatePath('/profile');
}
