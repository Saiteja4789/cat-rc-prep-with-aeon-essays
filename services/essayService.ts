import { Essay } from '../types';

// Use a full-text RSS service (morss.it) to get the complete essay content directly.
const FULL_TEXT_RSS_URL = 'https://morss.it/https://aeon.co/feed.rss';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FULL_TEXT_RSS_URL)}`;

export async function fetchEssays(): Promise<Essay[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch essays');
  const data = await res.json();
  // data.items is an array of articles
  return data.items
    .filter((item: any) => {
      const isVideo = (item.categories && item.categories.some((c: string) => c.toLowerCase().includes('video')))
        || (item.link && item.link.includes('/videos/'));
      return !isVideo;
    })
    .map((item: any, idx: number) => ({
      id: item.guid || String(idx + 1),
      title: item.title,
      author: item.author || 'Aeon',
      url: item.link,
      genre: item.categories && item.categories.length > 0 ? item.categories[0] : 'Essay',
      duration: 5, // RSS does not provide reading time; set a default or estimate from content length
      content: item.description.replace(/<[^>]+>/g, ''), // strip HTML tags
    }));
}

export async function fetchEssayById(id: string): Promise<Essay | null> {
  // The full content is now included in the initial fetch, so we just find the essay.
  const essays = await fetchEssays();
  return essays.find(e => e.id === id) || null;
}
