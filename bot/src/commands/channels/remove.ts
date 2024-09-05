import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/api";

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

    const res = await api.guilds[":guildId"].channels[":channelId"].$delete({
      param: {
        guildId: interaction.guild.id,
        channelId: channel.id,
      },
    });

    if (res.status === 404)
      return interaction.followUp(`${channel} is not a counting channel.`);

    return interaction.followUp(
      `Removed ${channel} from the counting channels.`
    );
  },
} satisfies Command;
