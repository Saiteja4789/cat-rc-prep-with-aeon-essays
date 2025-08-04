import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

// Extract the main Aeon essay content from HTML
function extractMainContent(html: string): string {
  // Most Aeon essays are inside <article> tags
  const match = html.match(/<article[\s\S]*?<\/article>/i);
  if (match) {
    // Remove scripts/styles and return clean HTML
    return match[0]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
  }
  // Fallback: return everything inside <body>
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  return bodyMatch ? bodyMatch[0] : '';
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
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ content: mainContent });
  } catch (err) {
    return res.status(500).json({ error: 'Server error fetching essay' });
  }
}
