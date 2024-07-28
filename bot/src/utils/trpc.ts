import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@countify/api/src/router";

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});
