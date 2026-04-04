import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const candidateBooksTable = pgTable("candidate_books", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  coverUrl: text("cover_url").notNull(),
  synopsis: text("synopsis").notNull(),
  votes: integer("votes").notNull().default(0),
  isWinner: boolean("is_winner").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCandidateBookSchema = createInsertSchema(candidateBooksTable).omit({ id: true, votes: true, isWinner: true, createdAt: true });
export type InsertCandidateBook = z.infer<typeof insertCandidateBookSchema>;
export type CandidateBook = typeof candidateBooksTable.$inferSelect;
