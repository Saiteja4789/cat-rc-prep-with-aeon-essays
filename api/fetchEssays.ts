import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';

// Define a custom type for the items from the parser to include 'content:encoded'
interface CustomFeedItem {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  'content:encoded': string;
  categories: string[];
  guid: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const parser = new Parser<object, CustomFeedItem>();
  const aeonFeedUrl = 'https://aeon.co/feed.rss';

  try {
    const feed = await parser.parseURL(aeonFeedUrl);

    const essays = feed.items.map(item => ({
      id: item.guid,
      title: item.title,
      url: item.link,
      author: item.creator || 'N/A',
      content: item['content:encoded'],
      published: new Date(item.pubDate).toISOString(),
      // Ensure categories are always an array of strings for consistent filtering
      categories: Array.isArray(item.categories) ? item.categories.map(c => (typeof c === 'string' ? c : '')) : [],
    }));

    // Add CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Vercel automatically handles JSON serialization
    res.status(200).json({ items: essays });

  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch essays from Aeon.' });
  }
}
