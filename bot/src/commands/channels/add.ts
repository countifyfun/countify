import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/trpc";
import { TRPCClientError } from "@trpc/client";

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

    const channel = interaction.options.getChannel("channel", true);
    const count = interaction.options.getNumber("count") ?? 0;
    try {
      await api.channels.addChannel.mutate({
        channelId: channel.id,
        name: channel.name,
        count,
        guildId: interaction.guild.id,
      });
      return interaction.followUp(`Added ${channel} as a counting channel.`);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        if (err.message === "Guild not found") {
          await Promise.all([
            api.guilds.createGuild.mutate({
              id: interaction.guild.id,
              name: interaction.guild.name,
              iconUrl: interaction.guild.iconURL(),
            }),
            api.channels.addChannel.mutate({
              channelId: channel.id,
              name: channel.name,
              count,
              guildId: interaction.guild.id,
            }),
          ]);
          return interaction.followUp(
            `Added ${channel} as a counting channel.`
          );
        } else if (err.message === "Channel already exists") {
          return interaction.followUp(
            `${channel} has already been added as a counting channel.`
          );
        }
      }

      console.error(err);
    }
  },
} satisfies Command;
