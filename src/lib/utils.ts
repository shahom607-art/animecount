import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WatchTimeMetrics {
  totalEpisodes: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export function calculateWatchTime(totalEpisodesWatched: number, durationMinutes: number = 24): WatchTimeMetrics {
  const effectiveDuration = durationMinutes && durationMinutes > 0 ? durationMinutes : 24;
  const minutes = totalEpisodesWatched * effectiveDuration;
  
  const hours = Number((minutes / 60).toFixed(1));
  const days = Number((minutes / (60 * 24)).toFixed(2));
  const weeks = Number((minutes / (60 * 24 * 7)).toFixed(2));
  const months = Number((minutes / (60 * 24 * 30.4375)).toFixed(2)); // Average days in month
  const years = Number((minutes / (60 * 24 * 365.25)).toFixed(3));

  return {
    totalEpisodes: totalEpisodesWatched,
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
  };
}

export function formatTimeSummary(minutes: number) {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours < 24) return `${hours}h ${remainingMins}m`;
  const days = (minutes / (60 * 24)).toFixed(1);
  return `${days} days`;
}
