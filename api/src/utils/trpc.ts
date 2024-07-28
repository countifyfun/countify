import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
// TODO: make this only accessible through an auth token that only the bot has
export const publicProcedure = t.procedure;
