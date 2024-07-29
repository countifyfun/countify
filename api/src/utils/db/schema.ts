import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  id: text("id").primaryKey(),
  name: text("name"),
});

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  name: text("name"),
  guildId: text("guild_id").references(() => guilds.id),
  count: integer("count").default(0),
  lastUserId: text("last_user_id"),
});
