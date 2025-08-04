import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

// Robust HTML extraction for main Aeon essay content
function extractMainContent(html: string): string | null {
  // Extract <article> content only
  const match = html.match(/<article[\s\S]*?<\/article>/i);
  if (!match) return null;
  let articleHtml = match[0];
  // Remove unwanted tags
  articleHtml = articleHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<!--.*?-->/gs, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '');
  return articleHtml;
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
