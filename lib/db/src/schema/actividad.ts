import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const actividadTable = pgTable("actividad", {
  id: serial("id").primaryKey(),
  creadoEn: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  libroId: integer("libro_id").notNull(),
  tipo: text("tipo").notNull(),
  descripcion: text("descripcion").notNull().default(""),
  fotoUrl: text("foto_url"),
});

export const insertActividadSchema = createInsertSchema(actividadTable).omit({
  id: true,
  creadoEn: true,
});
export type InsertActividad = z.infer<typeof insertActividadSchema>;
export type Actividad = typeof actividadTable.$inferSelect;
