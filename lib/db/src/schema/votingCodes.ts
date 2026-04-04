import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const votingCodesTable = pgTable("voting_codes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("standard"),
  used: boolean("used").notNull().default(false),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVotingCodeSchema = createInsertSchema(votingCodesTable).omit({ id: true, used: true, usedAt: true, createdAt: true });
export type InsertVotingCode = z.infer<typeof insertVotingCodeSchema>;
export type VotingCode = typeof votingCodesTable.$inferSelect;
