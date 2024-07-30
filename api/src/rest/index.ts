import { Hono } from "hono";
import { db } from "../utils/db";
import { and, eq } from "drizzle-orm";
import { channels, guilds } from "../utils/db/schema";

export const restRouter = new Hono();

restRouter.get("/guilds/:guildId", async (c) => {
  const { guildId } = c.req.param();
  const guild = await db.query.guilds.findFirst({
    where: eq(guilds.id, guildId),
    with: {
      channels: true,
    },
  });
  if (!guild) return c.json({ error: "Guild not found" }, 404);
  return c.json({
    id: guild.id,
    name: guild.name,
    channels: guild.channels
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        count: channel.count ?? 0,
      }))
      .sort((a, b) => a.count - b.count),
  });
});

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
    count: channel.count ?? 0,
    lastUserId: channel.lastUserId,
    guild: {
      id: channel.guilds.id,
      name: channel.guilds.name,
    },
  });
});
