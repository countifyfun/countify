import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const apiEnv = createEnv({
  server: {
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.coerce.number().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_NAME: z.string().optional(),
    DATABASE_URL: z.string(),
    AUTH_TOKEN: z.string(),
  },
  clientPrefix: undefined,
  runtimeEnv: typeof Bun === "undefined" ? process.env : Bun.env,
  emptyStringAsUndefined: true,
});
