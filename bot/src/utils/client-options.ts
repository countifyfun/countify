import type { ClientOptions } from "discord.js";

export const botOptions = {
  intents: ["Guilds", "GuildMessages", "MessageContent"],
} satisfies ClientOptions;
