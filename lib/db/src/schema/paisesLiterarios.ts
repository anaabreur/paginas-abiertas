import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paisesLiterariosTable = pgTable("paises_literarios", {
  id: serial("id").primaryKey(),
  paisLiterario: text("pais_literario").notNull(),
  emoji: text("emoji").notNull(),
  descripcion: text("descripcion").notNull(),
  color: text("color").notNull(),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPaisLiterarioSchema = createInsertSchema(paisesLiterariosTable).omit({
  id: true,
  creadoEn: true,
});
export type InsertPaisLiterario = z.infer<typeof insertPaisLiterarioSchema>;
export type PaisLiterario = typeof paisesLiterariosTable.$inferSelect;
