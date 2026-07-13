import { pgTable, serial, integer, text, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sesionesVotacionTable = pgTable("sesiones_votacion", {
  id: serial("id").primaryKey(),
  creadoEn: timestamp("creado en", { withTimezone: true }).notNull().defaultNow(),
  titulo: text("titulo").notNull(),
  fechaLimite: date("fecha_limite"),
  abierto: boolean("abierto").notNull().default(true),
});

export const insertSesionVotacionSchema = createInsertSchema(sesionesVotacionTable).omit({
  id: true,
  creadoEn: true,
});
export type InsertSesionVotacion = z.infer<typeof insertSesionVotacionSchema>;
export type SesionVotacion = typeof sesionesVotacionTable.$inferSelect;
