import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a public Mercury Web Parser endpoint.
// It takes a URL and returns clean, readable article content.
const MERCURY_PARSER_API = `https://mercury-parser-production.fly.dev/parser?url=`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url || !/^https:\/\/aeon.co\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing Aeon URL' });
  }

  try {
    // Call the Mercury API to get the parsed article
    const response = await fetch(`${MERCURY_PARSER_API}${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      // Forward the error from the parser service
      const errorBody = await response.text();
      return res.status(response.status).json({ error: `Mercury Parser failed: ${errorBody}` });
    }

    const data = await response.json();

    // The parsed content is in the 'content' field (as HTML)
    if (data && data.content) {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      return res.status(200).json({ content: data.content });
    } else {
      return res.status(404).json({ error: 'Could not extract essay content using Mercury Parser.' });
    }

  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}
