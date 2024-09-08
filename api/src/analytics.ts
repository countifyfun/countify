import { CronJob } from "cron";
import { db } from "./utils/db";
import { analytics } from "./utils/db/schema";

export async function createAnalyticsCronJob() {
  new CronJob(
    "* * * * *",
    async () => {
      const currentDate = new Date();
      const channels = await db.query.channels.findMany();
      await db.insert(analytics).values(
        channels.map((channel) => ({
          timestamp: currentDate,
          guildId: channel.guildId,
          channelId: channel.id,
          count: channel.count,
        }))
      );
    },
    null,
    true,
    "Africa/Abidjan"
  );
}
