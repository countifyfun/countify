import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const apiEnv = createEnv({
  server: {
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    AUTH_TOKEN: z.string(),
  },
  clientPrefix: undefined,
  runtimeEnv: typeof Bun === "undefined" ? process.env : Bun.env,
  emptyStringAsUndefined: true,
});
