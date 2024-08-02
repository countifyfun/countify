import { TRPCClientError } from "@trpc/client";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/trpc";

export default {
  description: "Remove a counting channel",
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel to remove",
      channelTypes: [ChannelType.GuildText],
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply({
      ephemeral: true,
    });

    const channel = interaction.options.getChannel("channel", true);
    try {
      await api.channels.removeChannel.mutate({
        channelId: channel.id,
        guildId: interaction.guild.id,
      });
      return interaction.followUp(
        `Removed ${channel} from the counting channels.`
      );
    } catch (err) {
      if (err instanceof TRPCClientError) {
        if (err.message.includes("not found")) {
          return interaction.followUp(
            `${channel} has not been added as a counting channel.`
          );
        }
      }

      console.error(err);
    }
  },
} satisfies Command;
