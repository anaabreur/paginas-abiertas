import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const votacionTable = pgTable("votacion", {
  id: serial("id").primaryKey(),
  creadoEn: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  codigoId: integer("codigo_id").notNull(),
  libroId: integer("libro_id").notNull(),
  sesionId: integer("sesion_id").notNull(),
});

export type Votacion = typeof votacionTable.$inferSelect;
