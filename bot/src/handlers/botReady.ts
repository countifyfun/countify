import type { BotClient } from "../structures/client";

export default (client: BotClient<true>) => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
};
