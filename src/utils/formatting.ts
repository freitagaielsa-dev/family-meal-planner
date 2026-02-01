import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Format date to German locale
 */
export const formatDateDE = (date: Date | string, formatStr = 'd. MMM yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: de });
};

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string): string => {
  const dateObj = parseISO(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'gerade eben';
  } else if (diffInMinutes < 60) {
    return `vor ${diffInMinutes} Minute${diffInMinutes > 1 ? 'n' : ''}`;
  } else if (diffInHours < 24) {
    return `vor ${diffInHours} Stunde${diffInHours > 1 ? 'n' : ''}`;
  } else if (diffInDays < 7) {
    return `vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
  }
  return formatDateDE(date);
};

/**
 * Format meal category in German
 */
export const formatMealCategory = (category?: string): string => {
  const categoryMap: Record<string, string> = {
    breakfast: 'Frühstück',
    lunch: 'Mittagessen',
    dinner: 'Abendessen',
    snack: 'Snack',
  };
  return categoryMap[category || 'dinner'] || 'Sonstiges';
};

/**
 * Format meal type in German
 */
export const formatMealType = (type: 'breakfast' | 'lunch' | 'dinner'): string => {
  const typeMap = {
    breakfast: 'Frühstück',
    lunch: 'Mittagessen',
    dinner: 'Abendessen',
  };
  return typeMap[type];
};

/**
 * Format supermarket name
 */
export const formatSupermarket = (supermarket: string): string => {
  const nameMap: Record<string, string> = {
    edeka: 'Edeka',
    rewe: 'Rewe',
    aldi: 'Aldi',
    lidl: 'Lidl',
    other: 'Sonstige',
  };
  return nameMap[supermarket] || supermarket;
};

/**
 * Format picky eater reaction
 */
export const formatReaction = (reaction: string): string => {
  const reactionMap: Record<string, string> = {
    loved: '❤️ Geliebt',
    liked: '👍 Gemocht',
    neutral: '😐 Neutral',
    disliked: '👎 Nicht gemocht',
    refused: '🙅 Abgelehnt',
  };
  return reactionMap[reaction] || reaction;
};

/**
 * Get emoji for reaction
 */
export const getReactionEmoji = (reaction: string): string => {
  const emojiMap: Record<string, string> = {
    loved: '❤️',
    liked: '👍',
    neutral: '😐',
    disliked: '👎',
    refused: '🙅',
  };
  return emojiMap[reaction] || '';
};

/**
 * Format time in minutes
 */
export const formatTime = (minutes?: number): string => {
  if (!minutes) return '-';
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Format currency (EUR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format rating
 */
export const formatRating = (rating?: number): string => {
  if (!rating) return '-';
  return `⭐ ${rating.toFixed(1)}/5`;
};

/**
 * Get day name in German
 */
export const getDayNameDE = (dayKey: string): string => {
  const dayMap: Record<string, string> = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  };
  return dayMap[dayKey] || dayKey;
};

/**
 * Get abbreviated day name in German
 */
export const getDayNameAbbreviatedDE = (dayKey: string): string => {
  const dayMap: Record<string, string> = {
    monday: 'Mo',
    tuesday: 'Di',
    wednesday: 'Mi',
    thursday: 'Do',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'So',
  };
  return dayMap[dayKey] || dayKey;
};
