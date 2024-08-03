import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@countify/api/src/router";
import { botEnv } from "@countify/env/bot";

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
      headers: {
        Authorization: botEnv.AUTH_TOKEN,
      },
    }),
  ],
});
