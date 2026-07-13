import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const codigosVotacionTable = pgTable("codigos_votacion", {
  id: serial("id").primaryKey(),
  creadoEn: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  codigo: text("codigo").notNull().unique(),
  tipo: text("tipo").notNull().default("standard"),
  usado: boolean("usado").notNull().default(false),
  sesionId: integer("sesion_id").notNull(),
});

export const insertCodigoVotacionSchema = createInsertSchema(codigosVotacionTable).omit({
  id: true,
  usado: true,
  creadoEn: true,
});
export type InsertCodigoVotacion = z.infer<typeof insertCodigoVotacionSchema>;
export type CodigoVotacion = typeof codigosVotacionTable.$inferSelect;
