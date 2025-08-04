import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mercury Parser endpoint (public API)
const MERCURY_PARSER_API = 'https://mercury-parser-production.fly.dev/parser?url=';

// Fallback HTML in case Mercury Parser fails
const FALLBACK_HTML = `
  <div style="padding: 20px; font-family: Arial, sans-serif; color: #e2e8f0;">
    <h1>Essay Content Unavailable</h1>
    <p>We couldn't load this essay at the moment. Here's what you can do:</p>
    <ul>
      <li>Refresh the page to try again.</li>
      <li>Read the essay directly on <a href="https://aeon.co" style="color: #60a5fa;">Aeon.co</a>.</li>
      <li>Try another essay from the list.</li>
    </ul>
  </div>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  
  // Validate URL
  if (!url || !/^https:\/\/aeon\.co\//.test(url)) {
    console.error('Invalid URL provided:', url);
    return res.status(400).json({ 
      error: 'Invalid or missing Aeon URL',
      content: FALLBACK_HTML
    });
  }

  try {
    console.log('Fetching content from Mercury Parser for URL:', url);
    
    // Call Mercury Parser API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const mercuryUrl = `${MERCURY_PARSER_API}${encodeURIComponent(url)}`;
    console.log('Mercury Parser API URL:', mercuryUrl);
    
    let response;
    try {
      response = await fetch(mercuryUrl, {
        signal: controller.signal,
        headers: { 
          'User-Agent': 'Aeon-Reader-App/1.0',
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error details:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
        code: fetchError.code,
        type: fetchError.type
      });
      throw new Error(`Failed to fetch from Mercury Parser: ${fetchError.message}`);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mercury Parser API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url
      });
      throw new Error(`Mercury Parser failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate response
    if (!data?.content?.trim()) {
      console.error('Mercury Parser returned empty content for URL:', url);
      throw new Error('No content returned from Mercury Parser');
    }
    
    console.log('Successfully fetched content (first 100 chars):', data.content.substring(0, 100) + '...');
    
    // Cache the response for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ 
      content: data.content,
      source: 'mercury-parser'
    });
    
  } catch (error) {
    console.error('Error in fetchEssayContent:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: url
    });
    
    // Return fallback HTML with 200 status to keep the app running
    return res.status(200).json({ 
      content: FALLBACK_HTML,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
