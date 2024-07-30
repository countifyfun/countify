import { Hono } from "hono";
import { db } from "../utils/db";
import { and, eq } from "drizzle-orm";
import { channels } from "../utils/db/schema";

export const restRouter = new Hono();

restRouter.get("/guilds/:guildId/channels/:channelId", async (c) => {
  const { guildId, channelId } = c.req.param();
  const channel = await db.query.channels.findFirst({
    where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
    with: {
      guilds: true,
    },
  });
  if (!channel) return c.json({ error: "Channel not found" }, 404);
  if (!channel.guilds) return c.json({ error: "Guild not found" }, 404);

  return c.json({
    id: channel.id,
    name: channel.name,
    count: channel.count,
    lastUserId: channel.lastUserId,
    guild: {
      id: channel.guilds.id,
      name: channel.guilds.name,
    },
  });
});
