import { bucket } from "./storage";

export const talmoditApi = new sst.aws.Function("TalmoditApi", {
  url: true,
  link: [bucket],
  handler: "packages/functions/src/api.handler",
  environment: {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  },
});
