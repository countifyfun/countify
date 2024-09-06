import type { BotClient } from "../structures/client";
import { api } from "../utils/api";
import { isNumber, stripCommas } from "../utils/numbers";

export default (client: BotClient) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    // TODO: cache all api calls to avoid spamming the api
    const res = await api.guilds[":guildId"].channels[":channelId"].$get({
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });
    if (res.status === 404) return;

    const channel = await res.json();

    if (channel.options.oneByOne && message.author.id === channel.lastUserId)
      return message.delete();

    const messageSplit = message.content.split(/[ :\n]+/);
    const messageNumberString = stripCommas(messageSplit[0]);
    if (!isNumber(messageNumberString)) return message.delete();

    const messageNumber = parseInt(messageNumberString, 10);
    const nextCount = (channel.count ?? 0) + 1;
    if (nextCount !== messageNumber) return message.delete();

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        count: nextCount,
        lastUserId: message.author.id,
      },
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });
  });
};
