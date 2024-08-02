import type { Command, Interaction } from "../structures/command";
import { Event } from "../structures/event";

export default new Event({
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      if (!interaction.inGuild())
        return interaction.reply("This command can only be used in servers!");

      const commandSegments = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ].filter((x): x is string => !!x);

      const command = (await import(
        `../commands/${commandSegments.join("/")}`
      ).then((x) => x.default)) as Command;

      return await command.run({
        client,
        interaction: interaction as Interaction,
      });
    }
  },
});
