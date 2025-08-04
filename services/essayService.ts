import { Essay } from '../types';

// Endpoint for our new, reliable serverless function
const ESSAY_API_URL = '/api/fetchEssays';
const CACHE_KEY = 'essays';

/**
 * Fetches the list of essays from our new serverless function.
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
        console.error('Failed to parse cached essays:', e);
        sessionStorage.removeItem(CACHE_KEY);
      }
    }
  }

  const response = await fetch(ESSAY_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch essays from our API');
  }

  const data = await response.json();

  // **CRITICAL FIX:** Ensure data.items is an array before proceeding.
  if (!Array.isArray(data?.items)) {
    console.error('API response did not contain an array of items:', data);
    return []; // Return an empty array to prevent the app from crashing.
  }

  // **CRITICAL FIX:** Correctly filter out video content and map the data.
  const essays = data.items
    .filter((item: any) => {
      // The 'categories' field is a clean array of strings, but we should check case-insensitively.
      const hasVideoCategory = item.categories?.some((cat: string) => cat.toLowerCase().trim() === 'video');
      const hasVideoUrl = item.url?.includes('/video');
      return item.title && item.url && !hasVideoCategory && !hasVideoUrl;
    })
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
 */
export const fetchFullEssayContent = async (url: string): Promise<string> => {
  try {
    // **FIX:** Using the new, more reliable Mercury Parser endpoint.
    const response = await fetch(`/api/fetchEssayContent?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('EssayService fetch error:', errorData.error);
      throw new Error(errorData.error || 'Failed to fetch full essay content');
    }
    const data = await response.json();
    if (!data.content || !data.content.trim()) {
      console.error('EssayService: Mercury Parser returned empty content for', url);
      throw new Error('Essay content is missing or empty.');
    }
    console.log('EssayService: Got essay content (first 200 chars):', data.content.slice(0, 200));
    return data.content;
  } catch (error) {
    console.error('Error fetching full essay content:', error);
    throw error;
  }
};
