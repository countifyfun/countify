import { OpenAPIHono } from "@hono/zod-openapi";
import { guildsRouter } from "./router/guilds";
import { channelsRouter } from "./router/channels";
import { createAnalyticsCronJob } from "./analytics";

const app = new OpenAPIHono();

createAnalyticsCronJob();

app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

export const routes = app.route("/", guildsRouter).route("/", channelsRouter);
export type AppType = typeof routes;

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});
