import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string) || '';
  const baseUrl = 'https://animekai.cc';

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      referer: 'https://google.com/',
      'accept-language': 'en-US,en;q=0.9',
    });

    // Capture console logs
    let consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // 1. Go to search page
    await page.goto(`${baseUrl}/browser?keyword=${encodeURIComponent(query)}`, {
      waitUntil: 'domcontentloaded',
    });

    console.log('Navigated to search page:', `${baseUrl}/browser?keyword=${encodeURIComponent(query)}`);
    console.log(page);

    await page.waitForSelector('.listing li a', { timeout: 15000 });

    // 2. Get the first episode link
    const episodePath = await page.$eval('.listing li a', el => el.getAttribute('href'));
    if (!episodePath) throw new Error('Episode link not found');

    const episodeWatchUrl = `${baseUrl}${episodePath}#ep=1`;

    // 3. Go to watch page
    await page.goto(episodeWatchUrl, { waitUntil: 'domcontentloaded' });

    // 4. Wait for any console logs (e.g., HLS embed info)
    await new Promise(resolve => setTimeout(resolve, 3000));

    await browser.close();

    res.status(200).json({
      watchUrl: episodeWatchUrl,
      logs: consoleMessages,
    });
  } catch (err: any) {
    console.error('Scraper error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
