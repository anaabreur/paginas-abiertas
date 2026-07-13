import { pgTable, serial, integer, text, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const librosTable = pgTable("libros", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  autor: text("autor").notNull(),
  coverUrl: text("cover_url").notNull(),
  sinopsis: text("sinopsis").notNull(),
  genero: text("genero").notNull(),
  estatus: text("estatus").notNull(),
  paisLiterario: integer("pais_literario"),
  fechaInicio: date("fecha_inicio"),
  fechaFinal: date("fecha_final"),
  creadoEn: timestamp("creado en", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLibroSchema = createInsertSchema(librosTable).omit({
  id: true,
  creadoEn: true,
});
export type InsertLibro = z.infer<typeof insertLibroSchema>;
export type Libro = typeof librosTable.$inferSelect;
