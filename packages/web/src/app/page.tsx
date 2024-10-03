import { LandingPage } from "@/components/landingPage";
import Image from "next/image";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@talmodit/functions/src/api";
import SuperJSON from "superjson";
import { Resource } from "sst";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: Resource.TalmoditApi.url
    }),
  ],
  transformer: SuperJSON,
});

export default function Home() {
  const createArticleFromUrl = async (url: string) => {
    "use server";
    const article = await trpc.processUrl.mutate({ url });
    console.log(article);
  }
  return (
    <LandingPage />
  );
}
