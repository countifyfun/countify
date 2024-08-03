import { apiEnv } from "@countify/env/api";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/db/schema.ts",
  dbCredentials: {
    url: apiEnv.DATABASE_URL,
  },
  verbose: true,
});
