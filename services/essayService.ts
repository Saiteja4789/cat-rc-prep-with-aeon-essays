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
  return essays.find(e => e.id === id) || null;
}
