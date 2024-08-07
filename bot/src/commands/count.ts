import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import type { Command } from "../structures/command";
import { api } from "../utils/trpc";

export default {
  description: "Get the count of a counting channel",
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel to get the count from",
      channelTypes: [ChannelType.GuildText],
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });

    const channel =
      interaction.options.getChannel("channel") ?? interaction.channel!;
    const dbChannel = await api.channels.getChannel.query({
      guildId: interaction.guild.id,
      channelId: channel.id,
    });

    if (!dbChannel)
      return interaction.followUp(
        `${channel} has not been set as a counting channel`
      );

    return interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${interaction.guild.name} #${channel.name}`,
            iconURL: interaction.guild.iconURL() ?? undefined,
          })
          .setDescription(
            `The current count is **${(dbChannel.count ?? 0).toLocaleString("en-US")}**.\nThe next count is **${((dbChannel.count ?? 0) + 1).toLocaleString("en-US")}**.`
          )
          .setColor("Yellow"),
      ],
    });
  },
} satisfies Command;
