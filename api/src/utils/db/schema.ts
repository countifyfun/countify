import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

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
  lastMessageId: text("last_message_id"),
  // FIXME: should probably find a better way to do this
  oneByOne: boolean("one_by_one").notNull().default(false),
  resetOnFail: boolean("reset_on_fail").notNull().default(false),
  talking: boolean("talking").notNull().default(true),
  noDeletion: boolean("no_deletion").notNull().default(true),
});

export const channelRelations = relations(channels, ({ one }) => ({
  guild: one(guilds, {
    fields: [channels.guildId],
    references: [guilds.id],
  }),
}));
