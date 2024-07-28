import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structures/command";
import { api } from "../../utils/trpc";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping!"),
  run: async ({ interaction }) => {
    console.log(await api.getGuilds.query());
    interaction.reply(await api.greeting.query());
  },
} satisfies Command;
