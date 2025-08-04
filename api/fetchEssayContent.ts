import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url || !/^https:\/\/aeon.co\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing Aeon URL' });
  }

  try {
    // Debug: Return hardcoded HTML to test frontend rendering
    const testHtml = `
      <h1>Test Essay</h1>
      <p>This is a test essay to verify the frontend rendering works.</p>
      <p>If you see this, the issue is with the Mercury Parser or the API call to it.</p>
    `;
    
    console.log('Returning test HTML content');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ content: testHtml });
    
  } catch (err) {
    console.error('Server error in fetchEssayContent:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}
