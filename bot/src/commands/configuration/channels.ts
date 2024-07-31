import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
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
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("count")
            .setDescription("The count of the channel.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a counting channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to remove.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async ({ interaction }) => {
    await interaction.deferReply({
      ephemeral: true,
    });

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        {
          const channel = interaction.options.getChannel("channel", true);
          const count = interaction.options.getNumber("count") ?? 0;
          try {
            await api.channels.addChannel.mutate({
              channelId: channel.id,
              name: channel.name,
              count,
              guildId: interaction.guild.id,
            });
            return interaction.followUp(
              `Added ${channel} as a counting channel.`
            );
          } catch (err) {
            if (err instanceof TRPCClientError) {
              if (err.message === "Guild not found") {
                await api.guilds.createGuild.mutate({
                  id: interaction.guild.id,
                  name: interaction.guild.name,
                  iconUrl: interaction.guild.iconURL(),
                });
                await api.channels.addChannel.mutate({
                  channelId: channel.id,
                  name: channel.name,
                  count,
                  guildId: interaction.guild.id,
                });
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
        }
        break;
      case "remove":
        {
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
              if (err.message === "Channel not found") {
                return interaction.followUp(
                  `${channel} has not been added as a counting channel.`
                );
              }
            }

            console.error(err);
          }
        }
        break;
    }
  },
} satisfies Command;
