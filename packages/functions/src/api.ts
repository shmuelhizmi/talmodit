import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { getUrlContent } from "./crawler";
import { transformContentToCleanMd } from "./transformer";
import { researchText } from "./research";
import superjson from 'superjson';

const app = initTRPC.create({
  transformer: superjson,
});


const router = app.router({
  processUrl: app.procedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .output(z.object({
      md: z.string(),
    }))
    .mutation(async ({ input }) => {
      const content = await getUrlContent(input.url);
      const cleanMD = await transformContentToCleanMd(content);
      console.log(cleanMD);
      return { md: cleanMD };
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
      return JSON.stringify(response);
    }),
});

export const handler = awsLambdaRequestHandler({
  router: router,
  createContext: (opts) => opts,
});

export type AppRouter = typeof router;