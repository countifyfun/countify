import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/command";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping!"),
  run: ({ interaction }) => {
    interaction.reply("Pong!");
  },
} satisfies Command;
