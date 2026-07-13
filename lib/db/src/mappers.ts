import { and, count, desc, eq, gte } from "drizzle-orm";
import { db } from "./client";
import {
  miembrosTable,
  paisesLiterariosTable,
  librosTable,
  lectorasTable,
  sesionesVotacionTable,
  votacionTable,
  actividadTable,
} from "./schema";
import { ACTIVIDAD_TIPO, LIBRO_ESTATUS } from "./constants";
import type { Libro, Miembro, PaisLiterario, SesionVotacion, Actividad } from "./schema";

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export function formatTimestamp(value: Date | null | undefined): string {
  return value?.toISOString() ?? new Date().toISOString();
}

export function mapSesionVotacion(session: SesionVotacion) {
  return {
    id: session.id,
    title: session.titulo,
    status: session.abierto ? ("open" as const) : ("closed" as const),
    deadline: session.fechaLimite ? formatDate(session.fechaLimite) : null,
    createdAt: formatTimestamp(session.creadoEn),
  };
}

export function mapMiembro(member: Miembro, position: number) {
  return {
    id: member.id,
    alias: member.alias,
    avatar: member.avatar,
    points: member.puntos,
    rank: member.ranking,
    position,
    archived: !member.activa,
    createdAt: formatTimestamp(member.creadoEn),
  };
}

export async function mapPaisLiterario(
  country: PaisLiterario,
  index: number,
): Promise<{
  id: number;
  name: string;
  emoji: string;
  description: string;
  color: string;
  booksRead: number;
  displayOrder: number;
  updatedAt: string;
}> {
  const [booksReadRow] = await db
    .select({ total: count() })
    .from(librosTable)
    .where(
      and(
        eq(librosTable.paisLiterario, country.id),
        eq(librosTable.estatus, LIBRO_ESTATUS.TERMINADO),
      ),
    );

  return {
    id: country.id,
    name: country.paisLiterario,
    emoji: country.emoji,
    description: country.descripcion,
    color: country.color,
    booksRead: booksReadRow?.total ?? 0,
    displayOrder: index + 1,
    updatedAt: formatTimestamp(country.creadoEn),
  };
}

export async function getVoteCounts(sesionId: number): Promise<Map<number, number>> {
  const rows = await db
    .select({
      libroId: votacionTable.libroId,
      total: count(),
    })
    .from(votacionTable)
    .where(eq(votacionTable.sesionId, sesionId))
    .groupBy(votacionTable.libroId);

  return new Map(rows.map((row) => [row.libroId, row.total]));
}

export function mapLibroCandidato(
  libro: Libro,
  sesionId: number,
  votes: number,
  isWinner = false,
) {
  return {
    id: libro.id,
    sessionId: sesionId,
    title: libro.titulo,
    author: libro.autor,
    genre: libro.genero,
    coverUrl: libro.coverUrl,
    synopsis: libro.sinopsis,
    votes,
    isWinner,
    countryId: libro.paisLiterario,
    createdAt: formatTimestamp(libro.creadoEn),
  };
}

export async function getActividadForLibro(libroId: number): Promise<Actividad[]> {
  return db
    .select()
    .from(actividadTable)
    .where(eq(actividadTable.libroId, libroId))
    .orderBy(desc(actividadTable.creadoEn));
}

export async function mapLibroEnRuta(libro: Libro) {
  const actividades = await getActividadForLibro(libro.id);
  const cine = actividades.find((a) => a.tipo === ACTIVIDAD_TIPO.CINE);

  return {
    id: libro.id,
    title: libro.titulo,
    author: libro.autor,
    genre: libro.genero,
    coverUrl: libro.coverUrl,
    synopsis: libro.sinopsis,
    currentWeek: 1,
    totalWeeks: 6,
    nextSessionDate: "",
    nextSessionDescription: "",
    weekActivity: cine?.descripcion ?? "",
    motivationalPhrase: "",
    createdAt: formatTimestamp(libro.creadoEn),
    updatedAt: formatTimestamp(libro.creadoEn),
  };
}

export async function mapExpedicion(libro: Libro) {
  const actividades = await getActividadForLibro(libro.id);
  const cine = actividades.find((a) => a.tipo === ACTIVIDAD_TIPO.CINE);

  const readerRows = await db
    .select({ member: miembrosTable })
    .from(lectorasTable)
    .innerJoin(miembrosTable, eq(lectorasTable.miembrosId, miembrosTable.id))
    .where(eq(lectorasTable.librosId, libro.id));

  return {
    id: libro.id,
    countryId: libro.paisLiterario ?? 0,
    title: libro.titulo,
    author: libro.autor,
    coverUrl: libro.coverUrl,
    startDate: formatDate(libro.fechaInicio),
    endDate: formatDate(libro.fechaFinal),
    closingActivity: cine ? "custom" : "none",
    closingActivityDesc: cine?.descripcion ?? "",
    description: libro.sinopsis,
    displayOrder: libro.id,
    createdAt: formatTimestamp(libro.creadoEn),
    readers: readerRows.map((row) => ({
      id: row.member.id,
      alias: row.member.alias,
      avatar: row.member.avatar,
    })),
  };
}

export async function getLatestSesionVotacion() {
  const [session] = await db
    .select()
    .from(sesionesVotacionTable)
    .orderBy(desc(sesionesVotacionTable.creadoEn))
    .limit(1);

  return session ?? null;
}

export async function getActiveSesionVotacion() {
  const [session] = await db
    .select()
    .from(sesionesVotacionTable)
    .where(eq(sesionesVotacionTable.abierto, true))
    .orderBy(desc(sesionesVotacionTable.creadoEn))
    .limit(1);

  return session ?? null;
}

export async function getCandidatosForSesion(sesionCreadoEn: Date) {
  return db
    .select()
    .from(librosTable)
    .where(
      and(
        eq(librosTable.estatus, LIBRO_ESTATUS.CANDIDATO),
        gte(librosTable.creadoEn, sesionCreadoEn),
      ),
    );
}

export async function getOrCreateGaleriaLibro(paisId: number) {
  const [existing] = await db
    .select()
    .from(librosTable)
    .where(
      and(
        eq(librosTable.paisLiterario, paisId),
        eq(librosTable.estatus, LIBRO_ESTATUS.TERMINADO),
        eq(librosTable.titulo, `Galería ${paisId}`),
      ),
    )
    .limit(1);

  if (existing) return existing;

  const [pais] = await db
    .select()
    .from(paisesLiterariosTable)
    .where(eq(paisesLiterariosTable.id, paisId))
    .limit(1);

  const [created] = await db
    .insert(librosTable)
    .values({
      titulo: `Galería ${paisId}`,
      autor: "Páginas Abiertas",
      coverUrl: "",
      sinopsis: pais?.paisLiterario ?? "Galería",
      genero: pais?.paisLiterario ?? "Galería",
      estatus: LIBRO_ESTATUS.TERMINADO,
      paisLiterario: paisId,
    })
    .returning();

  return created;
}

export async function upsertActividad(
  libroId: number,
  tipo: string,
  descripcion: string,
  fotoUrl?: string | null,
) {
  const [existing] = await db
    .select()
    .from(actividadTable)
    .where(and(eq(actividadTable.libroId, libroId), eq(actividadTable.tipo, tipo)))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(actividadTable)
      .set({
        descripcion,
        ...(fotoUrl !== undefined ? { fotoUrl } : {}),
      })
      .where(eq(actividadTable.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(actividadTable)
    .values({
      libroId,
      tipo,
      descripcion,
      fotoUrl: fotoUrl ?? null,
    })
    .returning();

  return created;
}
