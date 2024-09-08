import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";

export default {
  description: "Update the visibility of a counting channel.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "visibility",
      description: "The visibility of this counting channel",
      choices: [
        { name: "Public", value: "PUBLIC" },
        { name: "Unlisted", value: "UNLISTED" },
      ],
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

    const channel =
      interaction.options.getChannel("channel") ?? interaction.channel!;

    const res = await api.guilds[":guildId"].channels[
      ":channelId"
    ].internal.$get({
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    if (res.status === 404)
      return interaction.followUp(
        `${channel} has not been set as a counting channel.`
      );

    const visibility = interaction.options.getString("visibility", true) as
      | "PUBLIC"
      | "UNLISTED";

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        settings: {
          visibility,
        },
      },
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    return interaction.followUp(
      `${channel} is now set to ${visibility.toLowerCase()}.`
    );
  },
} satisfies Command;
