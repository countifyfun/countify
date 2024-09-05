import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { guilds } from "../utils/db/schema";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { redis } from "../utils/redis";
import { onlyAllowInternalRequests } from "../utils/middleware";
import { zValidator } from "@hono/zod-validator";

const guildRoute = createRoute({
  method: "get",
  summary: "Get a guild",
  description: "Get information about a specific guild",
  operationId: "getGuild",
  path: "/guilds/{guildId}",
  request: {
    params: z.object({
      guildId: z.string(),
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

export const guildsRouter = new OpenAPIHono()
  .openapi(guildRoute, async (c) => {
    const { guildId } = c.req.valid("param");

    const cachedData = await redis.get(`guild:${guildId}`);
    if (cachedData) return c.json(JSON.parse(cachedData), 200);

    const guild = await db.query.guilds.findFirst({
      where: eq(guilds.id, guildId),
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
  })
  .post(
    "/guilds",
    onlyAllowInternalRequests,
    zValidator(
      "json",
      z.object({
        id: z.string(),
        name: z.string(),
        iconUrl: z.string().nullable(),
      })
    ),
    async (c) => {
      const { id, name, iconUrl } = c.req.valid("json");

      if (await db.query.guilds.findFirst({ where: eq(guilds.id, id) }))
        return c.json({ error: "Guild already exists" }, 409);

      await db.insert(guilds).values({
        id,
        name,
        iconUrl,
      });

      return c.json({ success: true }, 200);
    }
  )
  .patch(
    "/guilds/:guildId",
    onlyAllowInternalRequests,
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        iconUrl: z.string().nullable().optional(),
      })
    ),
    async (c) => {
      const { guildId } = c.req.param();
      const { name, iconUrl } = c.req.valid("json");

      if (
        !(await db.query.guilds.findFirst({
          where: eq(guilds.id, guildId),
        }))
      )
        return c.json({ error: "Guild not found" }, 404);

      await db
        .update(guilds)
        .set({
          name,
          iconUrl,
        })
        .where(eq(guilds.id, guildId));

      return c.json({ success: true }, 200);
    }
  );
