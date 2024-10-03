import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { getUrlContent } from "./crawler";
import { transformContentToCleanMd } from "./transformer";
import { researchText } from "./research";

const app = initTRPC.create();

const router = app.router({
  processUrl: app.procedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const content = await getUrlContent(input.url);
      const cleanMd = await transformContentToCleanMd(content);
      return cleanMd;
    }),
  researchText: app.procedure
    .input(
      z.object({
        quote: z.string(),
        context: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await researchText(input.quote, input.context);
      return response;
    }),
});

export const handler = awsLambdaRequestHandler({
  router: router,
  createContext: (opts) => opts,
});
