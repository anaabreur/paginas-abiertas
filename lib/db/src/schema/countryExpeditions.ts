import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { literaryCountriesTable } from "./literaryCountries";

export const countryExpeditionsTable = pgTable("country_expeditions", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id")
    .notNull()
    .references(() => literaryCountriesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("cover_url").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  closingActivity: text("closing_activity").notNull().default("none"),
  closingActivityDesc: text("closing_activity_desc").notNull().default(""),
  description: text("description").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExpeditionSchema = createInsertSchema(countryExpeditionsTable).omit({ id: true, createdAt: true });
export type InsertExpedition = z.infer<typeof insertExpeditionSchema>;
export type CountryExpedition = typeof countryExpeditionsTable.$inferSelect;
