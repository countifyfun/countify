import type { BotClient } from "../structures/client";
import { api } from "../utils/api";

export default (client: BotClient<true>) => {
  client.on("guildCreate", async (guild) => {
    await api.guilds.$post({
      json: {
        id: guild.id,
        name: guild.name,
        iconUrl: guild.iconURL(),
      },
    });
  });

  client.on("guildUpdate", async (guild) => {
    await api.guilds[":guildId"].$patch({
      json: {
        name: guild.name,
        iconUrl: guild.iconURL(),
      },
      param: {
        guildId: guild.id,
      },
    });
  });
};
