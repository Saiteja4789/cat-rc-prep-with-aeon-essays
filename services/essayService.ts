import { Essay } from '../types';

// Fetch and parse Aeon essays from their RSS feed using a public RSS-to-JSON proxy
const RSS_TO_JSON = 'https://api.rss2json.com/v1/api.json?rss_url=https://aeon.co/feed.rss';

export async function fetchEssays(): Promise<Essay[]> {
  const res = await fetch(RSS_TO_JSON);
  if (!res.ok) throw new Error('Failed to fetch essays');
  const data = await res.json();
  // data.items is an array of articles
  return data.items.map((item: any, idx: number) => ({
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
  const essays = await fetchEssays();
  const essay = essays.find(e => e.id === id);
  if (!essay) return null;

  try {
    // Call the serverless function to get full content
    const apiUrl = `/api/fetchEssayContent?url=${encodeURIComponent(essay.url)}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        return { ...essay, content: data.content };
      }
    }
  } catch (err) {
    // Ignore and use fallback
  }
  // Fallback to RSS description if full content fetch fails
  return essay;
}
