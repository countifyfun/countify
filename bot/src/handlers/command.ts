import type { BotClient } from "../structures/client";
import type { Command, Interaction } from "../structures/command";
import { importDefault } from "../utils/import";

export default (client: BotClient<true>) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      if (!interaction.inGuild())
        return interaction.reply("This command can only be used in servers!");

      const commandSegments = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ].filter((x): x is string => !!x);

      const command = await importDefault<Command>(
        `../commands/${commandSegments.join("/")}`
      );
      if (!command) return;

      return command.run({
        client,
        interaction: interaction as Interaction,
      });
    }
  });
};
