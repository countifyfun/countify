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
import { importDefault } from "../utils/import";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(botEnv.DISCORD_TOKEN);
  }

  register() {
    this._registerCommands();
    this._registerHandlers();
  }

  private async _registerCommands() {
    const commands: ApplicationCommandDataResolvable[] = [];

    const files = await readdir(join(process.cwd(), "src/commands"));
    for (const fileName of files.filter((file) => !file.startsWith("_"))) {
      if (fileName.includes(".")) {
        const command = await importDefault<Command>(`../commands/${fileName}`);
        if (!command) continue;
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
        const metaFile = await importDefault<SubcommandMeta>(
          `../commands/${fileName}/_meta.ts`
        );
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

  private async _registerHandlers() {
    const featureFiles = await readdir(join(process.cwd(), "src/handlers"));
    for (const file of featureFiles) {
      const feature = await import(`../handlers/${file}`).then(
        (x) => x.default
      );
      feature(this);
    }
  }
}
