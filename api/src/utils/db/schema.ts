import { relations } from "drizzle-orm";
import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const guilds = mysqlTable("guilds", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
});

export const guildRelations = relations(guilds, ({ many }) => ({
  channels: many(channels),
}));

export const channels = mysqlTable("channels", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
  guildId: varchar("guild_id", { length: 255 }),
  count: int("count").default(0),
  lastUserId: text("last_user_id"),
});

export const channelRelations = relations(channels, ({ one }) => ({
  guilds: one(guilds, {
    fields: [channels.guildId],
    references: [guilds.id],
  }),
}));
