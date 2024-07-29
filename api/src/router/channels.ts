import { z } from "zod";
import { procedure, router } from "../utils/trpc";
import { channels, guilds } from "../utils/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const channelsRouter = router({
  getChannels: procedure
    .input(z.object({ guildId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (
        !(await ctx.db.query.guilds.findFirst({
          where: eq(guilds.id, input.guildId),
        }))
      )
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guild not found",
        });

      return await ctx.db.query.channels.findMany({
        where: eq(channels.guildId, input.guildId),
      });
    }),
  addChannel: procedure
    .input(
      z.object({
        channelId: z.string(),
        guildId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(await ctx.db.query.guilds.findFirst({
          where: eq(guilds.id, input.guildId),
        }))
      )
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guild not found",
        });
      if (
        await ctx.db.query.channels.findFirst({
          where: eq(channels.id, input.channelId),
        })
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel already exists",
        });

      const createdChannels = await ctx.db
        .insert(channels)
        .values({
          id: input.channelId,
          guildId: input.guildId,
          name: input.name,
          count: 0,
        })
        .returning();
      return createdChannels[0];
    }),
  setCount: procedure
    .input(
      z.object({
        guildId: z.string(),
        channelId: z.string(),
        count: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(channels)
        .set({ count: input.count })
        .where(
          and(
            (eq(channels.id, input.channelId),
            eq(channels.guildId, input.guildId)),
          ),
        );
      return { success: true };
    }),
  updateLastUser: procedure
    .input(
      z.object({
        channelId: z.string(),
        guildId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(channels)
        .set({ lastUserId: input.userId })
        .where(
          and(
            (eq(channels.id, input.channelId),
            eq(channels.guildId, input.guildId)),
          ),
        );
      return { success: true };
    }),
});
