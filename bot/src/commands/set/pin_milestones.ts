import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";

export default {
  description:
    "Pin a message every time a new milestone is reached. (100, 200, 300, 400, 500, etc.)",
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      name: "enabled",
      description: "Whether no deletion should be enabled or not",
      required: false,
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

    const data = await res.json();

    const enabled =
      interaction.options.getBoolean("enabled") ??
      !data.settings?.pinMilestones;

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        settings: {
          pinMilestones: enabled,
        },
      },
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    return interaction.followUp(
      `${enabled ? "Enabled" : "Disabled"} milestone pinning for ${channel}.`
    );
  },
} satisfies Command;
