import { prisma } from '@/lib/prisma';

export interface AnimeSearchResult {
  id: string;
  anilistId: number | null;
  malId: number | null;
  titleEnglish: string | null;
  titleJapanese: string | null;
  titleRomaji: string;
  posterImage: string | null;
  bannerImage: string | null;
  description: string | null;
  genres: string[];
  studios: string[];
  episodes: number;
  duration: number;
  season: string | null;
  year: number | null;
  status: string | null;
  popularity: number;
  averageScore: number;
  meanScore: number;
  synonyms: string[];
  trailerUrl: string | null;
  coverColor: string | null;
}

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';
const JIKAN_API_URL = 'https://api.jikan.moe/v4';

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 30) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        color
      }
      bannerImage
      description(asHtml: false)
      episodes
      duration
      season
      seasonYear
      status
      popularity
      averageScore
      meanScore
      genres
      synonyms
      studios(isMain: true) {
        nodes {
          name
        }
      }
      trailer {
        id
        site
      }
    }
  }
}
`;

export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  if (!query || query.trim().length === 0) return getTrendingAnime();

  const cleanQuery = query.trim().toLowerCase();

  // 1. Fetch from AniList GraphQL directly to access the complete global anime dataset
  try {
    const res = await fetch(ANILIST_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { search: cleanQuery },
      }),
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const mediaList = data?.data?.Page?.media || [];
      if (mediaList.length > 0) {
        const results: AnimeSearchResult[] = [];
        for (const media of mediaList) {
          const saved = await upsertAnimeToDb(media);
          results.push(saved);
        }
        return results;
      }
    }
  } catch (error) {
    console.warn('AniList API failed, falling back to Jikan API:', error);
  }

  // 2. Fallback to Jikan REST API for additional coverage
  try {
    const res = await fetch(`${JIKAN_API_URL}/anime?q=${encodeURIComponent(cleanQuery)}&limit=30`);
    if (res.ok) {
      const data = await res.json();
      const list = data?.data || [];
      if (list.length > 0) {
        const results: AnimeSearchResult[] = [];
        for (const item of list) {
          const formatted = await upsertJikanToDb(item);
          results.push(formatted);
        }
        return results;
      }
    }
  } catch (error) {
    console.error('Jikan API fallback failed:', error);
  }

  // 3. Fallback to local DB cache if offline
  try {
    const cachedMatches = await prisma.anime.findMany({
      where: {
        OR: [
          { titleRomaji: { contains: cleanQuery, mode: 'insensitive' } },
          { titleEnglish: { contains: cleanQuery, mode: 'insensitive' } },
          { titleJapanese: { contains: cleanQuery, mode: 'insensitive' } },
        ],
      },
      take: 30,
    });
    return cachedMatches.map(formatDbAnime);
  } catch (error) {
    console.error('Cache fallback error:', error);
  }

  return [];
}

export async function getTrendingAnime(): Promise<AnimeSearchResult[]> {
  try {
    const cached = await prisma.anime.findMany({
      orderBy: { popularity: 'desc' },
      take: 12,
    });
    if (cached.length >= 6) {
      return cached.map(formatDbAnime);
    }
  } catch (err) {
    console.error('Failed fetching cached trending:', err);
  }

  // Fetch trending from AniList
  const TRENDING_QUERY = `
  query {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        idMal
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        description(asHtml: false)
        episodes
        duration
        season
        seasonYear
        status
        popularity
        averageScore
        meanScore
        genres
        synonyms
        studios(isMain: true) { nodes { name } }
        trailer { id site }
      }
    }
  }
  `;

  try {
    const res = await fetch(ANILIST_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: TRENDING_QUERY }),
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const data = await res.json();
      const mediaList = data?.data?.Page?.media || [];
      const results: AnimeSearchResult[] = [];
      for (const media of mediaList) {
        const saved = await upsertAnimeToDb(media);
        results.push(saved);
      }
      return results;
    }
  } catch (error) {
    console.error('Trending fetch failed:', error);
  }
  return [];
}

function formatDbAnime(anime: any): AnimeSearchResult {
  return {
    id: anime.id,
    anilistId: anime.anilistId,
    malId: anime.malId,
    titleEnglish: anime.titleEnglish,
    titleJapanese: anime.titleJapanese,
    titleRomaji: anime.titleRomaji,
    posterImage: anime.posterImage,
    bannerImage: anime.bannerImage,
    description: anime.description,
    genres: anime.genres || [],
    studios: anime.studios || [],
    episodes: anime.episodes || 12,
    duration: anime.duration || 24,
    season: anime.season,
    year: anime.year,
    status: anime.status,
    popularity: anime.popularity || 0,
    averageScore: anime.averageScore || 0,
    meanScore: anime.meanScore || 0,
    synonyms: anime.synonyms || [],
    trailerUrl: anime.trailerUrl,
    coverColor: anime.coverColor,
  };
}

async function upsertAnimeToDb(media: any): Promise<AnimeSearchResult> {
  const titleRomaji = media.title?.romaji || media.title?.english || 'Unknown Anime';
  const studios = media.studios?.nodes?.map((n: any) => n.name) || [];
  const trailerUrl = media.trailer?.site === 'youtube' ? `https://youtube.com/watch?v=${media.trailer.id}` : null;

  const animeData = {
    anilistId: media.id,
    malId: media.idMal || null,
    titleEnglish: media.title?.english || null,
    titleJapanese: media.title?.native || null,
    titleRomaji,
    posterImage: media.coverImage?.extraLarge || media.coverImage?.large || null,
    bannerImage: media.bannerImage || null,
    description: media.description ? media.description.replace(/<[^>]*>?/gm, '') : null,
    genres: media.genres || [],
    studios,
    episodes: media.episodes || 12,
    duration: media.duration || 24,
    season: media.season || null,
    year: media.seasonYear || null,
    status: media.status || null,
    popularity: media.popularity || 0,
    averageScore: media.averageScore || 0,
    meanScore: media.meanScore || 0,
    synonyms: media.synonyms || [],
    trailerUrl,
    coverColor: media.coverImage?.color || null,
  };

  try {
    const record = await prisma.anime.upsert({
      where: { anilistId: media.id },
      update: animeData,
      create: animeData,
    });
    return formatDbAnime(record);
  } catch (err) {
    console.error('Failed upserting anime to DB:', err);
    return { id: String(media.id), ...animeData };
  }
}

async function upsertJikanToDb(item: any): Promise<AnimeSearchResult> {
  const animeData = {
    malId: item.mal_id,
    titleEnglish: item.title_english || null,
    titleJapanese: item.title_japanese || null,
    titleRomaji: item.title || 'Unknown Anime',
    posterImage: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
    bannerImage: null,
    description: item.synopsis || null,
    genres: item.genres?.map((g: any) => g.name) || [],
    studios: item.studios?.map((s: any) => s.name) || [],
    episodes: item.episodes || 12,
    duration: item.duration ? parseInt(item.duration) || 24 : 24,
    season: item.season || null,
    year: item.year || null,
    status: item.status || null,
    popularity: item.popularity || 0,
    averageScore: item.score ? Math.round(item.score * 10) : 0,
    meanScore: item.score ? Math.round(item.score * 10) : 0,
    synonyms: item.titles?.map((t: any) => t.title) || [],
    trailerUrl: item.trailer?.url || null,
    coverColor: null,
  };

  try {
    const record = await prisma.anime.upsert({
      where: { malId: item.mal_id },
      update: animeData,
      create: animeData,
    });
    return formatDbAnime(record);
  } catch (err) {
    return { id: String(item.mal_id), anilistId: null, ...animeData };
  }
}
