import {
  Client,
  Collection,
  type ApplicationCommandDataResolvable,
} from "discord.js";
import { botOptions } from "../utils/client-options";
import { readdir } from "fs/promises";
import { join } from "path";
import type { Command } from "./command";
import { botEnv } from "@countify/env/bot";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  commands = new Collection<string, Command>();

  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(botEnv.DISCORD_TOKEN);
  }

  register() {
    this._registerCommands();
    this._registerEvents();
    this._registerFeatures();
  }

  private async _registerCommands() {
    const commands: ApplicationCommandDataResolvable[] = [];

    const directories = await readdir(join(process.cwd(), "src/commands"));
    for (const directory of directories) {
      const commandFiles = await readdir(
        join(process.cwd(), "src/commands", directory)
      );
      for (const file of commandFiles) {
        const command = await import(`../commands/${directory}/${file}`).then(
          (x) => x.default
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

  private async _registerFeatures() {
    const featureFiles = await readdir(join(process.cwd(), "src/features"));
    for (const file of featureFiles) {
      const feature = await import(`../features/${file}`).then(
        (x) => x.default
      );
      feature(this);
    }
  }
}
