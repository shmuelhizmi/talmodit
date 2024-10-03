import FirecrawlApp from "@mendable/firecrawl-js";
import trpc from "@trpc/server";

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function getUrlContent(url: string) {
  const crawlResponse = await app.crawlUrl(url, {
    limit: 100,
    scrapeOptions: {
      formats: ["markdown", "extract"],
      onlyMainContent: true,
    },
  });

  if (!crawlResponse.success) {
    throw new Error(`Failed to crawl: ${crawlResponse}`);
  }

  return crawlResponse.data[0].markdown!;
}
