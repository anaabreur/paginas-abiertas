import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const votingSessionsTable = pgTable("voting_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("open"),
  deadline: timestamp("deadline", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVotingSessionSchema = createInsertSchema(votingSessionsTable).omit({ id: true, createdAt: true });
export type InsertVotingSession = z.infer<typeof insertVotingSessionSchema>;
export type VotingSession = typeof votingSessionsTable.$inferSelect;
