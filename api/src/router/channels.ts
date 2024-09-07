import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { redis } from "../utils/redis";
import { db } from "../utils/db";
import { and, eq } from "drizzle-orm";
import { channels, guilds } from "../utils/db/schema";
import { onlyAllowInternalRequests } from "../utils/middleware";
import { zValidator } from "@hono/zod-validator";

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

export const channelsRouter = new OpenAPIHono()
  .openapi(channelRoute, async (c) => {
    const { guildId, channelId } = c.req.valid("param");

    const cachedData = await redis.get(`channel:${guildId}:${channelId}`);
    if (cachedData) return c.json(JSON.parse(cachedData), 200);

    const channel = await db.query.channels.findFirst({
      where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
      with: {
        guild: true,
      },
    });
    if (!channel) return c.json({ error: "Channel not found" }, 404);
    if (!channel.guild) return c.json({ error: "Guild not found" }, 404);

    const data = {
      id: channel.id,
      name: channel.name,
      count: channel.count ?? 0,
      lastUserId: channel.lastUserId,
      guild: {
        id: channel.guild.id,
        name: channel.guild.name,
      },
    };
    await redis.set(`channel:${guildId}:${channelId}`, JSON.stringify(data), {
      EX: 2,
    });

    return c.json(data, 200);
  })
  .get(
    "/guilds/:guildId/channels/:channelId/internal",
    onlyAllowInternalRequests,
    async (c) => {
      const { guildId, channelId } = c.req.param();

      const channel = await db.query.channels.findFirst({
        where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
        with: {
          guild: true,
        },
      });
      if (!channel) return c.json({ error: "Channel not found" }, 404);
      if (!channel.guild) return c.json({ error: "Guild not found" }, 404);

      return c.json({
        id: channel.id,
        name: channel.name,
        count: channel.count ?? 0,
        lastUserId: channel.lastUserId,
        guild: {
          id: channel.guild.id,
          name: channel.guild.name,
        },
        settings: {
          oneByOne: channel.oneByOne,
        },
      });
    }
  )
  .post(
    "/guilds/:guildId/channels",
    onlyAllowInternalRequests,
    zValidator(
      "json",
      z.object({
        id: z.string(),
        guildId: z.string(),
        name: z.string(),
        count: z.number().default(0),
        lastUserId: z.string().nullable(),
      })
    ),
    async (c) => {
      const { guildId } = c.req.param();
      const { id, name, count, lastUserId } = c.req.valid("json");

      if (!(await db.query.guilds.findFirst({ where: eq(guilds.id, guildId) })))
        return c.json({ error: "Guild not found" }, 404);
      if (await db.query.channels.findFirst({ where: eq(channels.id, id) }))
        return c.json({ error: "Channel already exists" }, 409);

      await db.insert(channels).values({
        id,
        guildId,
        name,
        count,
        lastUserId,
      });

      return c.json({ success: true }, 200);
    }
  )
  .patch(
    "/guilds/:guildId/channels/:channelId",
    onlyAllowInternalRequests,
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        count: z.number().optional(),
        lastUserId: z.string().optional(),
        settings: z
          .object({
            oneByOne: z.boolean().optional(),
          })
          .optional(),
      })
    ),
    async (c) => {
      const { guildId, channelId } = c.req.param();
      const { name, count, lastUserId, settings } = c.req.valid("json");

      if (
        !(await db.query.channels.findFirst({
          where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
        }))
      )
        return c.json({ error: "Channel not found" }, 404);

      await db
        .update(channels)
        .set({
          name,
          count,
          lastUserId,
          oneByOne: settings?.oneByOne,
        })
        .where(and(eq(channels.id, channelId), eq(channels.guildId, guildId)));

      return c.json({ success: true }, 200);
    }
  )
  .delete(
    "/guilds/:guildId/channels/:channelId",
    onlyAllowInternalRequests,
    async (c) => {
      const { guildId, channelId } = c.req.param();

      if (
        !(await db.query.channels.findFirst({
          where: and(eq(channels.id, channelId), eq(channels.guildId, guildId)),
        }))
      )
        return c.json({ error: "Channel not found" }, 404);

      await db
        .delete(channels)
        .where(and(eq(channels.id, channelId), eq(channels.guildId, guildId)));

      return c.json({ success: true }, 200);
    }
  );
