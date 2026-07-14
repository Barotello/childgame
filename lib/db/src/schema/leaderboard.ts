import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leaderboardEntriesTable = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  nickname: text("nickname").notNull(),
  coins: integer("coins").notNull().default(0),
  avatar: jsonb("avatar").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntriesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type LeaderboardEntryRow = typeof leaderboardEntriesTable.$inferSelect;
