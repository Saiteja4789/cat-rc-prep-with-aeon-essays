import { Essay } from '../types';

// Endpoint for our new, reliable serverless function
const ESSAY_API_URL = '/api/fetchEssays';
const CACHE_KEY = 'essays';

/**
 * Fetches the list of essays (title, summary, etc.) from our new serverless function.
 */
export const fetchEssays = async (forceRefresh = false): Promise<Essay[]> => {
  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const essays = JSON.parse(cachedData);
        if (Array.isArray(essays) && essays.length > 0) {
          return essays;
        }
      } catch (e) {
        console.error('Failed to parse cached essays', e);
        sessionStorage.removeItem(CACHE_KEY); // Clear corrupted cache
      }
    }
  }

  const response = await fetch(ESSAY_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch essays from our API');
  }
  const data = await response.json();

  // Filter out video content and ensure essential fields are present
  const essays = data.items
    .filter((item: any) => 
      item.title &&
      item.url &&
      !item.categories?.includes('Video') && 
      !item.url.includes('/video/')
    )
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      author: item.author || 'N/A',
      content: item.content, // This is the summary from the RSS feed
      published: item.published,
      categories: item.categories || [],
    }));

  sessionStorage.setItem(CACHE_KEY, JSON.stringify(essays));
  return essays;
};

/**
 * Fetches the full HTML content of a single essay using our serverless function.
 * @param url The URL of the essay to fetch.
 * @returns The full HTML content of the essay.
 */
export async function fetchFullEssayContent(url: string): Promise<string> {
  const response = await fetch(`/api/fetchFullEssay?url=${encodeURIComponent(url)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch full essay content.');
  }

  const data = await response.json();
  return data.content;
}

