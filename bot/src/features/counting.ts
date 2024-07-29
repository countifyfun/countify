import { TRPCClientError } from "@trpc/client";
import type { BotClient } from "../structures/client";
import { api } from "../utils/trpc";

const isNumber = (str: string) => /^\d+$/.test(str);

function stripCommas(str: string) {
  return str.replace(/,/g, "");
}

export default (client: BotClient) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    try {
      // TODO: cache all api calls to avoid spamming the api
      const channels = await api.channels.getChannels.query({
        guildId: message.guild.id,
      });
      const currentChannel = channels.find(
        (channel) => channel.id === message.channel.id
      );
      if (!channels.length || !currentChannel) return;

      const messageSplit = message.content.split(/[ :\n]+/);
      const messageNumberString = stripCommas(messageSplit[0]);
      if (!isNumber(messageNumberString)) return message.delete();

      const messageNumber = parseInt(messageNumberString, 10);
      const nextCount = (currentChannel.count ?? 0) + 1;
      if (nextCount !== messageNumber) return message.delete();

      await Promise.all([
        api.channels.setCount.mutate({
          channelId: currentChannel.id,
          guildId: message.guild.id,
          count: nextCount,
        }),
        api.channels.updateLastUser.mutate({
          channelId: currentChannel.id,
          guildId: message.guild.id,
          userId: message.author.id,
        }),
      ]);
    } catch (err) {
      if (err instanceof TRPCClientError && err.message === "Guild not found")
        return;
      console.error(err);
    }
  });
};
