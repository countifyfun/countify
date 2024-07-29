import { z } from "zod";
import { procedure, router } from "../utils/trpc";
import { guilds } from "../utils/db/schema";

export const guildsRouter = router({
  createGuild: procedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createdGuilds = await ctx.db
        .insert(guilds)
        .values({
          id: input.id,
          name: input.name,
        })
        .returning();
      return createdGuilds[0];
    }),
});
