import { EmbedBuilder, type Message } from "discord.js";
import type { BotClient } from "../structures/client";
import { api } from "../utils/api";
import { isNumber, stripCommas } from "../utils/numbers";

async function resetOnFail(message: Message<true>, error: string) {
  await api.guilds[":guildId"].channels[":channelId"].$patch({
    json: {
      count: 0,
      lastUserId: null,
    },
    param: {
      guildId: message.guild.id,
      channelId: message.channel.id,
    },
  });

  message.react("❌");

  return message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle("💥 Oh no!")
        .setDescription(
          `${message.author} ${error}. The count has been reset to 0!`
        )
        .setColor("Red"),
    ],
  });
}

export default (client: BotClient) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.inGuild()) return;

    // TODO: cache all api calls to avoid spamming the api
    const res = await api.guilds[":guildId"].channels[
      ":channelId"
    ].internal.$get({
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });
    if (res.status === 404) return;

    const channel = await res.json();

    if (channel.settings.oneByOne && message.author.id === channel.lastUserId)
      return message.delete();

    const messageSplit = message.content.split(/[ :\n]+/);
    if (!channel.settings.talking && messageSplit.length > 1) {
      if (channel.settings.resetOnFail) {
        resetOnFail(message, "talked in their counting message");
      } else message.delete();
      return;
    }

    const messageNumberString = stripCommas(messageSplit[0]);
    if (!isNumber(messageNumberString)) {
      if (channel.settings.resetOnFail) {
        resetOnFail(message, "got the count wrong");
      } else message.delete();
      return;
    }

    const messageNumber = parseInt(messageNumberString, 10);
    const nextCount = (channel.count ?? 0) + 1;

    if (channel.settings.resetOnFail) {
      if (nextCount === messageNumber) message.react("✅");
      else return resetOnFail(message, "got the count wrong");
    } else if (nextCount !== messageNumber) return message.delete();

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        count: nextCount,
        lastUserId: message.author.id,
        lastMessageId: message.id,
      },
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });

    if (channel.settings.pinMilestones && nextCount % 100 === 0) {
      const pins = await message.channel.messages.fetchPinned();
      if (pins.size >= 50) await pins.first()?.unpin();
      await message.pin();
    }
  });

  client.on("messageDelete", async (message) => {
    if (message.author?.bot || !message.inGuild()) return;

    const res = await api.guilds[":guildId"].channels[
      ":channelId"
    ].internal.$get({
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });
    if (res.status === 404) return;

    const channel = await res.json();

    if (
      !channel.settings.noDeletion ||
      !channel.lastMessageId ||
      channel.lastMessageId !== message.id
    )
      return;

    const messageSplit = message.content.split(/[ :\n]+/);
    const messageNumberString = messageSplit[0].split(",").join("");

    const newMessage = await message.channel.send({
      content: `${message.author}: ${messageNumberString}`,
    });

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        lastMessageId: newMessage.id,
      },
      param: {
        guildId: message.guild.id,
        channelId: message.channel.id,
      },
    });
  });
};
