import { Router, type IRouter } from "express";
import { asc, desc, eq, and, isNotNull } from "drizzle-orm";
import {
  db,
  paisesLiterariosTable,
  librosTable,
  actividadTable,
  LIBRO_ESTATUS,
  ACTIVIDAD_TIPO,
  mapPaisLiterario,
  mapExpedicion,
  mapLibroCandidato,
  formatTimestamp,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/literary-countries", async (_req, res): Promise<void> => {
  const countries = await db
    .select()
    .from(paisesLiterariosTable)
    .orderBy(asc(paisesLiterariosTable.id));

  res.json(
    await Promise.all(countries.map((country, index) => mapPaisLiterario(country, index))),
  );
});

router.get("/literary-countries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [country] = await db
    .select()
    .from(paisesLiterariosTable)
    .where(eq(paisesLiterariosTable.id, id));

  if (!country) {
    res.status(404).json({ message: "País literario no encontrado" });
    return;
  }

  res.json(await mapPaisLiterario(country, country.id - 1));
});

router.get("/literary-countries/:id/expeditions", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const expeditions = await db
    .select()
    .from(librosTable)
    .where(
      and(
        eq(librosTable.paisLiterario, id),
        eq(librosTable.estatus, LIBRO_ESTATUS.TERMINADO),
      ),
    )
    .orderBy(asc(librosTable.id));

  res.json(await Promise.all(expeditions.map((expedition) => mapExpedicion(expedition))));
});

router.get("/literary-countries/:id/books", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const books = await db
    .select()
    .from(librosTable)
    .where(
      and(
        eq(librosTable.paisLiterario, id),
        eq(librosTable.estatus, LIBRO_ESTATUS.TERMINADO),
      ),
    )
    .orderBy(desc(librosTable.creadoEn));

  res.json(
    books.map((book) => ({
      ...mapLibroCandidato(book, 0, 0),
      createdAt: formatTimestamp(book.creadoEn),
    })),
  );
});

router.get("/literary-countries/:id/gallery", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const photos = await db
    .select({
      id: actividadTable.id,
      countryId: librosTable.paisLiterario,
      url: actividadTable.fotoUrl,
      caption: actividadTable.descripcion,
      displayOrder: actividadTable.id,
      createdAt: actividadTable.creadoEn,
    })
    .from(actividadTable)
    .innerJoin(librosTable, eq(actividadTable.libroId, librosTable.id))
    .where(
      and(
        eq(librosTable.paisLiterario, id),
        eq(actividadTable.tipo, ACTIVIDAD_TIPO.VISITA),
        isNotNull(actividadTable.fotoUrl),
      ),
    )
    .orderBy(asc(actividadTable.id));

  res.json(
    photos.map((photo) => ({
      id: photo.id,
      countryId: photo.countryId ?? id,
      url: photo.url ?? "",
      caption: photo.caption,
      displayOrder: photo.displayOrder,
      createdAt: formatTimestamp(photo.createdAt),
    })),
  );
});

export default router;
