import { apiEnv } from "@countify/env/api";
import { createClient } from "redis";

export const redis = createClient({
  url: apiEnv.REDIS_URL,
  password: apiEnv.REDIS_PASSWORD,
});

await redis.connect();
