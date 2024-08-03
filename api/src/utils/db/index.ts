import { apiEnv } from "@countify/env/api";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(apiEnv.DATABASE_URL);

export const db = drizzle(client, { schema });
