import type {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
  PermissionResolvable,
} from "discord.js";
import type { BotClient } from "./client";

export interface Interaction extends ChatInputCommandInteraction<"cached"> {}

export interface Command {
  description: string;
  options?: [ApplicationCommandOptionData, ...ApplicationCommandOptionData[]];
  permissions?: [PermissionResolvable, ...PermissionResolvable[]];
  run: ({
    client,
    interaction,
  }: {
    client: BotClient<true>;
    interaction: Interaction;
  }) => void;
}

export interface SubcommandMeta {
  description: string;
  permissions?: [PermissionResolvable, ...PermissionResolvable[]];
}
