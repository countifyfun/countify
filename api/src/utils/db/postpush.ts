import { sql } from "drizzle-orm";
import { db } from ".";

async function main() {
  try {
    await db.execute(
      sql`SELECT create_hypertable('analytics', by_range('timestamp'))`
    );
  } catch (err) {
    console.log(
      "An error occured while creating hypertable. Hypertable probably already exists."
    );
  }
  process.exit(0);
}

main();
