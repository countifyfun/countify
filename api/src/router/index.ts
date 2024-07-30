import { router } from "../utils/trpc";
import { channelsRouter } from "./channels";
import { guildsRouter } from "./guilds";

export const appRouter = router({
  channels: channelsRouter,
  guilds: guildsRouter,
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
