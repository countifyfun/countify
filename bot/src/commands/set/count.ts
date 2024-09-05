import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";

export default {
  description: "Update a counting channel's current count",
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: "count",
      description: "The new count for the counting channel",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The counting channel to update",
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });

    const count = interaction.options.getInteger("count", true);
    const channel =
      interaction.options.getChannel("channel") ?? interaction.channel!;

    const res = await api.guilds[":guildId"].channels[":channelId"].$get({
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    if (res.status === 404)
      return interaction.followUp(
        `${channel} has not been set as a counting channel.`
      );

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        count,
      },
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    return interaction.followUp(
      `${channel}'s count has been updated to ${count.toLocaleString()}.`
    );
  },
} satisfies Command;
