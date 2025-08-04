import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parse } from 'node-html-parser';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const articleResponse = await fetch(url);
    if (!articleResponse.ok) {
      throw new Error(`Failed to fetch article. Status: ${articleResponse.status}`);
    }
    const html = await articleResponse.text();
    const root = parse(html);

    // Aeon's main content is within a <div class="article__body"> element
    const articleBody = root.querySelector('.article__body');

    if (!articleBody) {
      return res.status(404).json({ error: 'Main article content not found.' });
    }

    // Return the inner HTML of the article body
    res.status(200).json({ content: articleBody.innerHTML });

  } catch (error: any) {
    console.error(`Error fetching from ${url}:`, error);
    res.status(500).json({ error: 'Failed to fetch or parse essay content.', details: error.message });
  }
}
