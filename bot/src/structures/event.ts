import type { ClientEvents } from "discord.js";
import type { BotClient } from "./client";

export interface EventOptions<E extends keyof ClientEvents> {
  name: E;
  run: (client: BotClient<true>, ...args: ClientEvents[E]) => void;
}

export class Event<E extends keyof ClientEvents> {
  name: E;
  run: (client: BotClient<true>, ...args: ClientEvents[E]) => void;

  constructor(options: EventOptions<E>) {
    this.name = options.name;
    this.run = options.run;
  }
}
