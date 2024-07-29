import { procedure, router } from "../utils/trpc";
import { channelsRouter } from "./channels";
import { guildsRouter } from "./guilds";

export const appRouter = router({
  greeting: procedure.query(() => "Hello from tRPC v10!"),
  channels: channelsRouter,
  guilds: guildsRouter,
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
