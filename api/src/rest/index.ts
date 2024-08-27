import { db } from "../utils/db";
import { and, eq } from "drizzle-orm";
import { channels, guilds } from "../utils/db/schema";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { redis } from "../utils/redis";

export const restRouter = new OpenAPIHono();

const guildsRoute = createRoute({
  method: "get",
  summary: "Get a guild",
  description: "Get information about a specific guild",
  operationId: "getGuild",
  path: "/guilds/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Retrive a guild",
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            name: z.string(),
            channels: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                count: z.number(),
              })
            ),
          }),
        },
      },
    },
    404: {
      description: "Guild not found",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

restRouter.openapi(guildsRoute, async (c) => {
  const { id } = c.req.valid("param");

  const cachedData = await redis.get(`guild:${id}`);
  if (cachedData) return c.json(JSON.parse(cachedData), 200);

  const guild = await db.query.guilds.findFirst({
    where: eq(guilds.id, id),
    with: {
      channels: true,
    },
  });
  if (!guild) return c.json({ error: "Guild not found" }, 404);

  const data = {
    id: guild.id,
    name: guild.name,
    channels: guild.channels
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        count: channel.count ?? 0,
      }))
      .sort((a, b) => a.count - b.count),
  };
  await redis.set(`guild:${guild.id}`, JSON.stringify(data), {
    EX: 2,
  });

  return c.json(data, 200);
});

const channelRoute = createRoute({
  method: "get",
  summary: "Get a counting channel",
  description: "Get information about a specific counting channel",
  operationId: "getChannel",
  path: "/guilds/{guildId}/channels/{channelId}",
  request: {
    params: z.object({
      guildId: z.string(),
      channelId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Retrive a counting channel",
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            name: z.string(),
            count: z.number(),
            lastUserId: z.string().nullable(),
            guild: z.object({
              id: z.string(),
              name: z.string(),
            }),
          }),
        },
      },
    },
    404: {
      description: "Channel or guild not found",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

restRouter.openapi(channelRoute, async (c) => {
  const { guildId, channelId } = c.req.valid("param");

  const cachedData = await redis.get(`channel:${guildId}:${channelId}`);
  if (cachedData) return c.json(JSON.parse(cachedData), 200);

  const channel = await db.query.channels.findFirst({
    where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
    with: {
      guilds: true,
    },
  });
  if (!channel) return c.json({ error: "Channel not found" }, 404);
  if (!channel.guilds) return c.json({ error: "Guild not found" }, 404);

  const data = {
    id: channel.id,
    name: channel.name,
    count: channel.count ?? 0,
    lastUserId: channel.lastUserId,
    guild: {
      id: channel.guilds.id,
      name: channel.guilds.name,
    },
  };
  await redis.set(`channel:${guildId}:${channelId}`, JSON.stringify(data), {
    EX: 2,
  });

  return c.json(data, 200);
});
