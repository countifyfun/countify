import { ApplicationCommandOptionType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";

export default {
  description: "Only allow one count per user.",
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      name: "enabled",
      description: "Whether one by one should be enabled or not.",
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });

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

    const data = await res.json();

    const enabled =
      interaction.options.getBoolean("enabled") ?? !data.options?.oneByOne;

    await api.guilds[":guildId"].channels[":channelId"].$patch({
      json: {
        options: {
          oneByOne: enabled,
        },
      },
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    return interaction.followUp(
      `${enabled ? "Enabled" : "Disabled"} one by one for ${channel}.`
    );
  },
} satisfies Command;
