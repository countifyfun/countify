import { ChannelType, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/trpc";
import { TRPCClientError } from "@trpc/client";

export default {
  data: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Manage counting channels for this server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a counting channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to add.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    ),
  run: async ({ interaction }) => {
    await interaction.deferReply({
      ephemeral: true,
    });

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add": {
        const channel = interaction.options.getChannel("channel", true);
        try {
          await api.channels.addChannel.mutate({
            channelId: channel.id,
            name: channel.name,
            guildId: interaction.guild.id,
          });
          return interaction.followUp(
            `Added ${channel} as a counting channel.`,
          );
        } catch (err) {
          if (err instanceof TRPCClientError) {
            if (err.message === "Guild not found") {
              await api.guilds.createGuild.mutate({
                id: interaction.guild.id,
                name: interaction.guild.name,
              });
              await api.channels.addChannel.mutate({
                channelId: channel.id,
                name: channel.name,
                guildId: interaction.guild.id,
              });
              return interaction.followUp(
                `Added ${channel} as a counting channel.`,
              );
            } else if (err.message === "Channel already exists") {
              return interaction.followUp(
                `${channel} has already been added as a counting channel.`,
              );
            }
          }

          console.error(err);
        }
      }
    }
  },
} satisfies Command;
