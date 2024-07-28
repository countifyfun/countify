import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./router";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

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
  }),
);

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});
