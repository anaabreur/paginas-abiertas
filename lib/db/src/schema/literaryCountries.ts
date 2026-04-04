import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const literaryCountriesTable = pgTable("literary_countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  booksRead: integer("books_read").notNull().default(0),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLiteraryCountrySchema = createInsertSchema(literaryCountriesTable).omit({ id: true, updatedAt: true });
export type InsertLiteraryCountry = z.infer<typeof insertLiteraryCountrySchema>;
export type LiteraryCountry = typeof literaryCountriesTable.$inferSelect;
