import { Essay } from '../types';

// Use Aeon's official, reliable RSS feed.
const RSS_FEED_URL = 'https://aeon.co/feed.rss';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}&count=50`;

const CACHE_KEY = 'essayListCache';

/**
 * Fetches the list of essays (title, summary, etc.) from the RSS feed.
 * This does NOT fetch the full content.
 */
export async function fetchEssays(forceRefresh = false): Promise<Essay[]> {
  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch the list of essays from Aeon.');
  }
  const data = await res.json();

  if (data.status !== 'ok') {
    throw new Error('RSS to JSON API returned an error.');
  }

  const essays = data.items
    .filter((item: any) => {
      const hasVideoCategory = item.categories?.some((cat: string) => cat.toLowerCase().includes('video'));
      const hasVideoUrl = item.link?.includes('/videos/');
      return !hasVideoCategory && !hasVideoUrl && item.title && item.content;
    })
    .map((item: any, idx: number) => ({
      id: item.guid || String(idx + 1),
      title: item.title,
      author: item.author || 'Aeon',
      url: item.link,
      genre: item.categories?.[0] || 'Essay',
      duration: 5, // Placeholder
      // Initially, content is the summary from the feed.
      content: item.content || item.description,
    }));

  sessionStorage.setItem(CACHE_KEY, JSON.stringify(essays));
  return essays;
}

/**
 * Fetches the full HTML content of a single essay using our serverless function.
 * @param url The URL of the essay to fetch.
 * @returns The full HTML content of the essay.
 */
export async function fetchFullEssayContent(url: string): Promise<string> {
  const response = await fetch(`/api/fetchFullEssay?url=${encodeURIComponent(url)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null); // Gracefully handle non-json responses
    throw new Error(errorData?.error || 'Failed to fetch full essay content.');
  }

  const data = await response.json();
  return data.content;
}

