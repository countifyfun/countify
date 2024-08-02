import { EmbedBuilder } from "discord.js";
import type { Command } from "../structures/command";

export default {
  description: "Ping the bot",
  run: async ({ client, interaction }) => {
    const res = await interaction.deferReply({
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle("Pong! 🏓")
          .setDescription(
            `🤖 Bot: **${ping}ms**\n📡 Discord API: **${client.ws.ping}ms**`
          )
          .setColor("Yellow"),
      ],
    });
  },
} satisfies Command;
