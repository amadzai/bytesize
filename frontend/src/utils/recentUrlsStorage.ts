import type { RecentUrlItem, ShortenUrlResponse } from '../types/urls';

const RECENT_URLS_STORAGE_KEY = 'recent_urls';
const MAX_RECENT_URLS = 5;

const isRecentUrlItem = (value: unknown): value is RecentUrlItem => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as RecentUrlItem;

  return (
    typeof candidate.short_url === 'string' &&
    typeof candidate.target_url === 'string' &&
    (typeof candidate.title === 'string' || candidate.title === null) &&
    typeof candidate.created_at === 'number'
  );
};

export const readRecentUrls = (): RecentUrlItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_URLS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRecentUrlItem);
  } catch {
    return [];
  }
};

export const writeRecentUrls = (items: RecentUrlItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    RECENT_URLS_STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_RECENT_URLS)),
  );
};

export const addRecentUrl = (response: ShortenUrlResponse): RecentUrlItem[] => {
  const current = readRecentUrls();
  const deduped = current.filter(
    (item) => item.short_url !== response.short_url,
  );
  const next: RecentUrlItem[] = [
    {
      short_url: response.short_url,
      target_url: response.target_url,
      title: response.title,
      created_at: Date.now(),
    },
    ...deduped,
  ];

  writeRecentUrls(next);

  return next.slice(0, MAX_RECENT_URLS);
};

export const clearRecentUrls = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(RECENT_URLS_STORAGE_KEY);
};
