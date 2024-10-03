import { Resource } from "sst";
import { Example } from "@talmodit/core/example";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@talmodit/functions/src/api";
import superjson from "superjson";

export async function main() {
  const client = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpLink({
        url: Resource.TalmoditApi.url,
      }),
    ],
  });

  const response = await client.processUrl.mutate({
    url: "https://sst.dev/docs/start/aws/trpc/",
  });
  console.log(response);
}

main();
