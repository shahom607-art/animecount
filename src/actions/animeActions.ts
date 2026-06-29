'use server';

import { searchAnime as searchAnimeService, getTrendingAnime as getTrendingAnimeService } from '@/services/animeService';

export async function searchAnimeAction(query: string) {
  return await searchAnimeService(query);
}

export async function getTrendingAnimeAction() {
  return await getTrendingAnimeService();
}
