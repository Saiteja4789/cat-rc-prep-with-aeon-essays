import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

// Use Cheerio to robustly extract the main Aeon essay content
function extractMainContent(html: string): string | null {
  const $ = cheerio.load(html);
  const article = $('article');
  if (!article.length) return null;
  // Remove unwanted tags from within the article
  article.find('script, style, noscript, iframe, link, aside').remove();
  // Remove comments
  article.contents().each(function () {
    if (this.type === 'comment') $(this).remove();
  });
  return article.html();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url || !/^https:\/\/aeon.co\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing Aeon URL' });
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch essay from Aeon' });
    }
    const html = await response.text();
    const mainContent = extractMainContent(html);
    if (!mainContent) {
      return res.status(404).json({ error: 'Could not extract essay content' });
    }
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ content: mainContent });
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching essay' });
  }
}
