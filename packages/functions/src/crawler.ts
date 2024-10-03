import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function getUrlContent(url: string) {
  const crawlResponse = await app.scrapeUrl(url, {
    formats: ["markdown"],
    onlyMainContent: true,
  });

  if (!crawlResponse.success) {
    throw new Error(`Failed to crawl: ${crawlResponse}`);
  }

  return crawlResponse.markdown!;
}
