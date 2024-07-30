import "@countify/env/api";

import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./router";
import { createContext } from "./utils/trpc";
import { restRouter } from "./rest";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

app.route("/", restRouter);

app.use(
  "/trpc/*",
  async (c, next) => {
    if (c.req.header("authorization") !== process.env.AUTH_TOKEN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return next();
  },
  trpcServer({
    router: appRouter,
    createContext,
    // eslint-disable-next-line prettier/prettier
  })
);

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});
