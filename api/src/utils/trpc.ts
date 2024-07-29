import { initTRPC } from "@trpc/server";
import { db } from "./db";

export const createContext = async () => {
  return { db };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
