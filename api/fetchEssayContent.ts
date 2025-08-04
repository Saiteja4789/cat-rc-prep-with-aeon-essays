import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import cheerio from 'cheerio';

// Scrolls a page to the bottom to trigger all lazy-loaded content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(true);
        }
      }, 100);
    });
  });
}

// Extracts the full HTML of a page using a headless browser with auto-scrolling
async function getFullPageHtml(url: string): Promise<string> {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await autoScroll(page);
    const content = await page.content();
    return content;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Extracts the main article content from the fully rendered HTML
function extractMainContent(html: string): string | null {
  const $ = cheerio.load(html);
  const article = $('article');
  if (!article.length) return null;
  // Clean up the article content
  article.find('script, style, noscript, iframe, link, aside, footer, header').remove();
  article.find('[class*="ad"], [id*="ad"]').remove(); // Remove ad containers
  return article.html();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url || !/^https:\/\/aeon.co\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing Aeon URL' });
  }

  try {
    const html = await getFullPageHtml(url);
    const mainContent = extractMainContent(html);

    if (!mainContent) {
      return res.status(404).json({ error: 'Could not extract essay content after rendering.' });
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ content: mainContent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during headless browser scraping.' });
  }
}
