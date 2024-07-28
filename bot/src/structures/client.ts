import {
  Client,
  Collection,
  type ApplicationCommandDataResolvable,
} from "discord.js";
import { botOptions } from "../utils/client-options";
import { readdir } from "fs/promises";
import { join } from "path";
import type { Command } from "./command";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  commands = new Collection<string, Command>();

  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(process.env.DISCORD_TOKEN);
  }

  register() {
    this._registerCommands();
    this._registerEvents();
  }

  private async _registerCommands() {
    const commands: ApplicationCommandDataResolvable[] = [];

    const directories = await readdir(join(process.cwd(), "src/commands"));
    for (const directory of directories) {
      const commandFiles = await readdir(
        join(process.cwd(), "src/commands", directory),
      );
      for (const file of commandFiles) {
        const command = await import(`../commands/${directory}/${file}`).then(
          (x) => x.default,
        );
        this.commands.set(command.data.toJSON().name, command);
        commands.push(command.data.toJSON());
      }
    }

    this.on("ready", async () => {
      await this.application!.commands.set(commands);
      console.log("Registered commands!");
    });
  }

  private async _registerEvents() {
    const eventFiles = await readdir(join(process.cwd(), "src/events"));
    for (const file of eventFiles) {
      const event = await import(`../events/${file}`).then((x) => x.default);
      this.on(event.name, event.run.bind(null, this));
    }
  }
}
