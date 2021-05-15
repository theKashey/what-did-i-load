import type{FactoredBrowser} from "./createBrowser";
// import {resolve} from 'path';

type Resource = {
  url: string;
  type: string;
  size: number;
  host: string
}

export async function measure(browser: FactoredBrowser, targetUrl: string): Promise<Resource[]> {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const resources: Resource[] = [];

  page.on('response', async (response) => {
    const url = response.url();
    const host = new URL(url).hostname;

    try {
      resources.push({
        host,
        url,
        type: response.headers()['content-type'],
        size: (await response.buffer()).length,
      })
    } catch (e) {
      console.error('error processing', url);
    }
  });

  await page.goto(targetUrl, {waitUntil: 'networkidle2'});

  // await page.screenshot({path: resolve(process.cwd(),'measure.png'), fullPage: true});

  await page.close();
  browser.close();

  return resources;
}