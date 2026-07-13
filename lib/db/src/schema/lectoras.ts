import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const lectorasTable = pgTable("lectoras", {
  id: serial("id").primaryKey(),
  librosId: integer("libros_id").notNull(),
  miembrosId: integer("miembros_id").notNull(),
});

export type Lectora = typeof lectorasTable.$inferSelect;
