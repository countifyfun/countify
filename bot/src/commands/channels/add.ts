import {
  ApplicationCommandOptionType,
  ChannelType,
  TextChannel,
} from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";
import { isNumber, stripCommas } from "../../utils/numbers";

export default {
  description: "Add a counting channel",
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel to add",
      channelTypes: [ChannelType.GuildText],
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: "count",
      description: "The initial count for the channel",
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply({
      ephemeral: true,
    });

    const channel = interaction.options.getChannel(
      "channel",
      true
    ) as TextChannel;
    let count = interaction.options.getNumber("count");
    let lastUserId = null;
    let lastMessageId = null;
    if (!count) {
      const lastMessage = (await channel.messages.fetch({ limit: 1 })).first();
      if (lastMessage) {
        const messageSplit = lastMessage.content.split(/[ :\n]+/);
        const messageNumberString = stripCommas(messageSplit[0]);
        if (isNumber(messageNumberString)) {
          count = parseInt(messageNumberString, 10);
          lastUserId = lastMessage.author.id;
          lastMessageId = lastMessage.id;
        }
      }
    }
    if (!count) count = 0;

    let res = await api.guilds[":guildId"].channels.$post({
      json: {
        id: channel.id,
        guildId: interaction.guild.id,
        name: channel.name,
        count,
        lastUserId,
        lastMessageId,
      },
      param: {
        guildId: interaction.guild.id,
      },
    });

    if (res.status === 409)
      return interaction.followUp(`${channel} is already a counting channel.`);

    if (res.status === 404 && (await res.json()).error === "Guild not found") {
      await api.guilds.$post({
        json: {
          id: interaction.guild.id,
          name: interaction.guild.name,
          iconUrl: interaction.guild.iconURL(),
        },
      });
      res = await api.guilds[":guildId"].channels.$post({
        json: {
          id: channel.id,
          guildId: interaction.guild.id,
          name: channel.name,
          count,
          lastUserId,
          lastMessageId,
        },
        param: {
          guildId: interaction.guild.id,
        },
      });
    }

    interaction.followUp(`Added ${channel} as a counting channel.`);
  },
} satisfies Command;
