import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const guilds = mysqlTable("guilds", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
});

export const channels = mysqlTable("channels", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
  guildId: varchar("guild_id", { length: 255 }).references(() => guilds.id),
  count: int("count").default(0),
  lastUserId: text("last_user_id"),
});
