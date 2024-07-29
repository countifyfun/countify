import { apiEnv } from "@countify/env/api";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: apiEnv.DATABASE_HOST,
  port: apiEnv.DATABASE_PORT,
  user: apiEnv.DATABASE_USER,
  password: apiEnv.DATABASE_PASSWORD,
  database: apiEnv.DATABASE_NAME,
});

export const db = drizzle(poolConnection, { mode: "default", schema });
