import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { BotClient } from "./client";

export interface Interaction extends ChatInputCommandInteraction<"cached"> {}

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  run: ({
    client,
    interaction,
  }: {
    client: BotClient<true>;
    interaction: Interaction;
  }) => void;
}
