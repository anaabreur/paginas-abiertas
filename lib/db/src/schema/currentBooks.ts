import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const currentBooksTable = pgTable("current_books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  coverUrl: text("cover_url").notNull(),
  synopsis: text("synopsis").notNull(),
  currentWeek: integer("current_week").notNull().default(1),
  totalWeeks: integer("total_weeks").notNull().default(6),
  nextSessionDate: text("next_session_date").notNull(),
  nextSessionDescription: text("next_session_description").notNull(),
  weekActivity: text("week_activity").notNull(),
  motivationalPhrase: text("motivational_phrase").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCurrentBookSchema = createInsertSchema(currentBooksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCurrentBook = z.infer<typeof insertCurrentBookSchema>;
export type CurrentBook = typeof currentBooksTable.$inferSelect;
