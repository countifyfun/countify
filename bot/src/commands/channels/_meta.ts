import type { SubcommandMeta } from "../../structures/command";

export default {
  description: "Manage counting channels for this server",
  permissions: ["ManageChannels"],
} satisfies SubcommandMeta;
