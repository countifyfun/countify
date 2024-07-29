import type { Interaction } from "../structures/command";
import { Event } from "../structures/event";

export default new Event({
  name: "interactionCreate",
  run: (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      if (!interaction.inGuild())
        return interaction.reply("This command can only be used in servers!");

      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      command.run({ client, interaction: interaction as Interaction });
    }
  },
});
