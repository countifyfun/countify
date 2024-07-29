import { apiEnv } from "@countify/env/api";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/utils/db/schema.ts",
  dbCredentials: {
    host: apiEnv.DATABASE_HOST,
    port: apiEnv.DATABASE_PORT,
    user: apiEnv.DATABASE_USER,
    password: apiEnv.DATABASE_PASSWORD,
    database: apiEnv.DATABASE_NAME,
  },
  verbose: true,
});
