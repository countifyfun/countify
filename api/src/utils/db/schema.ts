import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  iconUrl: text("icon_url"),
});

export const guildRelations = relations(guilds, ({ many }) => ({
  channels: many(channels),
}));

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  guildId: text("guild_id").notNull(),
  count: integer("count").notNull().default(0),
  lastUserId: text("last_user_id"),
});

export const channelRelations = relations(channels, ({ one }) => ({
  guilds: one(guilds, {
    fields: [channels.guildId],
    references: [guilds.id],
  }),
}));

export const analytics = pgTable("analytics", {
  timestamp: timestamp("timestamp", { withTimezone: true }).primaryKey(),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id),
  channelId: text("channel_id")
    .notNull()
    .references(() => channels.id),
  count: integer("count").notNull().default(0),
});
