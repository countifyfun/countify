import type { BotClient } from "../structures/client";
import { api } from "../utils/trpc";

export default (client: BotClient<true>) => {
  client.on("guildCreate", async (guild) => {
    await api.guilds.createGuild.mutate({
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL(),
    });
  });

  client.on("guildUpdate", async (guild) => {
    await api.guilds.updateGuild.mutate({
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL(),
    });
  });
};
