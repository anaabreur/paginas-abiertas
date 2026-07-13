import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const miembrosTable = pgTable("miembros", {
  id: serial("id").primaryKey(),
  alias: text("alias").notNull(),
  avatar: text("avatar").notNull(),
  puntos: integer("puntos").notNull().default(0),
  ranking: text("ranking").notNull().default("Novata"),
  activa: boolean("activa").notNull().default(true),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMiembroSchema = createInsertSchema(miembrosTable).omit({
  id: true,
  creadoEn: true,
});
export type InsertMiembro = z.infer<typeof insertMiembroSchema>;
export type Miembro = typeof miembrosTable.$inferSelect;
