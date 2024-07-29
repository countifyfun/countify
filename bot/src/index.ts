import "@countify/env/bot";

import { BotClient } from "./structures/client";

const client = new BotClient();
client.connect();
client.register();
