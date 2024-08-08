import type { SubcommandMeta } from "../../structures/command";

export default {
  description: "Update a counting channel's configuration",
  permissions: ["ManageChannels"],
} satisfies SubcommandMeta;
