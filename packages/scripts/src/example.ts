import { Resource } from "sst";
import { Example } from "@talmodit/core/example";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@talmodit/functions/src/api";
console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);

async function main() {
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpLink({
        url: Resource.MyApi.url,
      }),
    ],
  });

  const response = await client.processUrl.mutate({
    url: "https://sst.dev/docs/start/aws/trpc/",
  });
  console.log(response);
}

main();
