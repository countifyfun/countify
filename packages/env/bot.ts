import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const botEnv = createEnv({
  server: {
    DISCORD_TOKEN: z.string(),
    AUTH_TOKEN: z.string(),
  },
  clientPrefix: undefined,
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
});
