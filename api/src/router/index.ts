import { db } from "../utils/db";
import { publicProcedure, router } from "../utils/trpc";

export const appRouter = router({
  greeting: publicProcedure.query(() => "Hello from tRPC v10!"),
  getGuilds: publicProcedure.query(async () => {
    return await db.query.guilds.findMany()
  })
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
