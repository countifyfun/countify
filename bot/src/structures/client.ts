import {
  ApplicationCommandOptionType,
  Client,
  type ApplicationCommandDataResolvable,
  type ApplicationCommandSubCommandData,
  type ApplicationCommandSubGroupData,
} from "discord.js";
import { botOptions } from "../utils/client-options";
import { readdir } from "fs/promises";
import { join } from "path";
import type { Command, SubcommandMeta } from "./command";
import { botEnv } from "@countify/env/bot";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
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

    const files = await readdir(join(process.cwd(), "src/commands"));
    for (const fileName of files.filter((file) => !file.startsWith("_"))) {
      if (fileName.includes(".")) {
        const command = (await import(`../commands/${fileName}`).then(
          (x) => x.default
        )) as Command;
        const name = fileName.split(".")[0]!;
        commands.push({
          name,
          description: command.description,
          ...(command.options && { options: command.options }),
          ...(command.permissions && {
            defaultMemberPermissions: command.permissions,
          }),
        });
      } else {
        const metaFile = (await import(`../commands/${fileName}/_meta.ts`)
          .then((x) => x.default)
          .catch(() => null)) as SubcommandMeta | null;
        const subCommands = await (async function nestSubCommands(
          relativeSubPath: string,
          client: BotClient
        ) {
          const subFiles = await readdir(
            join(process.cwd(), "src/commands", fileName)
          );
          const subCommands: (
            | ApplicationCommandSubCommandData
            | ApplicationCommandSubGroupData
          )[] = [];
          for (const subFileName of subFiles.filter(
            (file) => !file.startsWith("_")
          )) {
            if (subFileName.includes(".")) {
              const subCommand = await import(
                `../commands/${fileName}/${subFileName}`
              ).then((x) => x.default);
              const name = subFileName.split(".")[0]!;
              subCommands.push({
                type: ApplicationCommandOptionType.Subcommand,
                name,
                description: subCommand.description,
                ...(subCommand.options && { options: subCommand.options }),
              });
            } else {
              const subSubCommands = await nestSubCommands(
                `${relativeSubPath}/${subFileName}`,
                client
              );
              subCommands.push({
                type: ApplicationCommandOptionType.SubcommandGroup,
                name: subFileName,
                description: "Subcommands",
                options: subSubCommands as never,
              });
            }
          }
          return subCommands;
        })(`src/commands/${fileName}`, this);
        if (subCommands.length) {
          commands.push({
            name: fileName,
            description: metaFile?.description ?? "Subcommand",
            options: subCommands,
            ...(metaFile?.permissions && {
              defaultMemberPermissions: metaFile.permissions,
            }),
          });
        }
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
