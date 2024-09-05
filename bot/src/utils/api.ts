import type { AppType } from "@countify/api/src/index";
import { botEnv } from "@countify/env/bot";
import { hc } from "hono/client";

export const api = hc<AppType>("http://localhost:3001", {
  headers: {
    Authorization: botEnv.AUTH_TOKEN,
  },
});
