import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  db,
  sesionesVotacionTable,
  librosTable,
  codigosVotacionTable,
  miembrosTable,
  paisesLiterariosTable,
  lectorasTable,
  actividadTable,
  votacionTable,
  LIBRO_ESTATUS,
  ACTIVIDAD_TIPO,
  getActiveSesionVotacion,
  getLatestSesionVotacion,
  getCandidatosForSesion,
  getVoteCounts,
  mapSesionVotacion,
  mapMiembro,
  mapPaisLiterario,
  mapExpedicion,
  mapLibroCandidato,
  mapLibroEnRuta,
  getOrCreateGaleriaLibro,
  upsertActividad,
  formatTimestamp,
} from "@workspace/db";
import { generateCode, getRank } from "../lib/nanoid";

const router: IRouter = Router();
const ADMIN_PASSWORD = "paginas2026";

router.post("/admin/verify", async (req, res): Promise<void> => {
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ message: "Contraseña incorrecta" });
  }
});

router.post("/admin/voting/session", async (req, res): Promise<void> => {
  const { title, deadline } = req.body as { title: string; deadline?: string };

  if (!title) {
    res.status(400).json({ message: "Título requerido" });
    return;
  }

  const [session] = await db
    .insert(sesionesVotacionTable)
    .values({
      titulo: title,
      abierto: true,
      fechaLimite: deadline ? deadline.slice(0, 10) : null,
    })
    .returning();

  res.json(mapSesionVotacion(session));
});

router.post("/admin/voting/session/:id/close", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [session] = await db
    .select()
    .from(sesionesVotacionTable)
    .where(eq(sesionesVotacionTable.id, id));

  if (!session) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  const books = await getCandidatosForSesion(session.creadoEn);
  const voteCounts = await getVoteCounts(session.id);
  const winner = [...books].sort(
    (a, b) => (voteCounts.get(b.id) ?? 0) - (voteCounts.get(a.id) ?? 0),
  )[0];

  if (winner) {
    await db
      .update(librosTable)
      .set({ estatus: LIBRO_ESTATUS.TERMINADO })
      .where(eq(librosTable.id, winner.id));
  }

  const [updated] = await db
    .update(sesionesVotacionTable)
    .set({ abierto: false })
    .where(eq(sesionesVotacionTable.id, id))
    .returning();

  res.json(mapSesionVotacion(updated));
});

router.post("/admin/voting/session/:id/open", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [updated] = await db
    .update(sesionesVotacionTable)
    .set({ abierto: true })
    .where(eq(sesionesVotacionTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  res.json(mapSesionVotacion(updated));
});

router.put("/admin/voting/session/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { deadline } = req.body as { deadline?: string | null };

  const [updated] = await db
    .update(sesionesVotacionTable)
    .set({ fechaLimite: deadline ? deadline.slice(0, 10) : null })
    .where(eq(sesionesVotacionTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  res.json(mapSesionVotacion(updated));
});

router.post("/admin/voting/books", async (req, res): Promise<void> => {
  const { title, author, genre, coverUrl, synopsis, countryId } = req.body as {
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    synopsis: string;
    countryId?: number | null;
  };

  const session = await getActiveSesionVotacion();
  if (!session || !session.abierto) {
    res.status(400).json({ message: "No hay sesión de votación activa" });
    return;
  }

  const [book] = await db
    .insert(librosTable)
    .values({
      titulo: title,
      autor: author,
      genero: genre,
      coverUrl,
      sinopsis: synopsis,
      estatus: LIBRO_ESTATUS.CANDIDATO,
      paisLiterario: countryId ?? null,
    })
    .returning();

  res.json(mapLibroCandidato(book, session.id, 0));
});

router.put("/admin/voting/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { title, author, genre, coverUrl, synopsis, isWinner } = req.body as Partial<{
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    synopsis: string;
    isWinner: boolean;
  }>;

  const data: Partial<typeof librosTable.$inferInsert> = {};
  if (title !== undefined) data.titulo = title;
  if (author !== undefined) data.autor = author;
  if (genre !== undefined) data.genero = genre;
  if (coverUrl !== undefined) data.coverUrl = coverUrl;
  if (synopsis !== undefined) data.sinopsis = synopsis;
  if (isWinner !== undefined) {
    data.estatus = isWinner ? LIBRO_ESTATUS.TERMINADO : LIBRO_ESTATUS.CANDIDATO;
  }

  const [updated] = await db
    .update(librosTable)
    .set(data)
    .where(eq(librosTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Libro no encontrado" });
    return;
  }

  const session = (await getActiveSesionVotacion()) ?? (await getLatestSesionVotacion());
  const voteCounts = session ? await getVoteCounts(session.id) : new Map<number, number>();

  res.json(
    mapLibroCandidato(updated, session?.id ?? 0, voteCounts.get(updated.id) ?? 0),
  );
});

router.delete("/admin/voting/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(votacionTable).where(eq(votacionTable.libroId, id));
  await db.delete(librosTable).where(eq(librosTable.id, id));
  res.json({ success: true });
});

router.get("/admin/voting/codes", async (_req, res): Promise<void> => {
  const session = (await getActiveSesionVotacion()) ?? (await getLatestSesionVotacion());
  if (!session) {
    res.json([]);
    return;
  }

  const codes = await db
    .select()
    .from(codigosVotacionTable)
    .where(eq(codigosVotacionTable.sesionId, session.id));

  res.json(
    codes.map((code) => ({
      id: code.id,
      sessionId: code.sesionId,
      code: code.codigo,
      type: code.tipo,
      used: code.usado,
      usedAt: null,
      createdAt: formatTimestamp(code.creadoEn),
    })),
  );
});

router.delete("/admin/voting/codes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db
    .delete(codigosVotacionTable)
    .where(eq(codigosVotacionTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ message: "Código no encontrado" });
    return;
  }

  res.json({ success: true });
});

router.post("/admin/voting/codes", async (req, res): Promise<void> => {
  const { quantity, type } = req.body as { quantity: number; type: "standard" | "premium" };

  if (!quantity || quantity < 1 || quantity > 200) {
    res.status(400).json({ message: "Cantidad inválida (1-200)" });
    return;
  }

  const session = await getActiveSesionVotacion();
  if (!session || !session.abierto) {
    res.status(400).json({ message: "No hay sesión de votación activa" });
    return;
  }

  const existingCodes = await db.select().from(codigosVotacionTable);
  const existingSet = new Set(existingCodes.map((code) => code.codigo));

  const newCodes: Array<{ sesionId: number; codigo: string; tipo: string }> = [];
  let attempts = 0;
  while (newCodes.length < quantity && attempts < 1000) {
    const code = generateCode(8);
    if (!existingSet.has(code)) {
      existingSet.add(code);
      newCodes.push({ sesionId: session.id, codigo: code, tipo: type });
    }
    attempts++;
  }

  const inserted = await db.insert(codigosVotacionTable).values(newCodes).returning();

  res.json(
    inserted.map((code: (typeof inserted)[number]) => ({
      id: code.id,
      sessionId: code.sesionId,
      code: code.codigo,
      type: code.tipo,
      used: code.usado,
      usedAt: null,
      createdAt: formatTimestamp(code.creadoEn),
    })),
  );
});

router.get("/admin/leaderboard", async (_req, res): Promise<void> => {
  const members = await db
    .select()
    .from(miembrosTable)
    .orderBy(desc(miembrosTable.puntos));

  res.json(members.map((member, index) => mapMiembro(member, index + 1)));
});

router.post("/admin/leaderboard", async (req, res): Promise<void> => {
  const { alias, avatar, points } = req.body as {
    alias: string;
    avatar: string;
    points: number;
  };

  if (!alias || !avatar) {
    res.status(400).json({ message: "Alias y avatar requeridos" });
    return;
  }

  const puntos = points ?? 0;
  const [member] = await db
    .insert(miembrosTable)
    .values({
      alias,
      avatar,
      puntos,
      ranking: getRank(puntos),
      activa: true,
    })
    .returning();

  const allMembers = await db
    .select()
    .from(miembrosTable)
    .where(eq(miembrosTable.activa, true))
    .orderBy(desc(miembrosTable.puntos));

  const position = allMembers.findIndex((row) => row.id === member.id) + 1;
  res.json(mapMiembro(member, position));
});

router.put("/admin/leaderboard/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { alias, avatar, points } = req.body as {
    alias?: string;
    avatar?: string;
    points?: number;
  };

  const updateData: Partial<typeof miembrosTable.$inferInsert> = {};
  if (alias !== undefined) updateData.alias = alias;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (points !== undefined) {
    updateData.puntos = points;
    updateData.ranking = getRank(points);
  }

  const [updated] = await db
    .update(miembrosTable)
    .set(updateData)
    .where(eq(miembrosTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Miembro no encontrado" });
    return;
  }

  const allMembers = await db
    .select()
    .from(miembrosTable)
    .where(eq(miembrosTable.activa, true))
    .orderBy(desc(miembrosTable.puntos));

  const position = allMembers.findIndex((row) => row.id === updated.id) + 1;
  res.json(mapMiembro(updated, position > 0 ? position : 0));
});

router.delete("/admin/members/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db
    .delete(miembrosTable)
    .where(eq(miembrosTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ message: "Miembro no encontrado" });
    return;
  }

  res.json({ success: true });
});

router.post("/admin/leaderboard/:id/archive", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [updated] = await db
    .update(miembrosTable)
    .set({ activa: false })
    .where(eq(miembrosTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Miembro no encontrado" });
    return;
  }

  res.json(mapMiembro(updated, 0));
});

router.put("/admin/current-book", async (req, res): Promise<void> => {
  const {
    title,
    author,
    genre,
    coverUrl,
    synopsis,
    weekActivity,
  } = req.body as {
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    synopsis: string;
    currentWeek?: number;
    totalWeeks?: number;
    nextSessionDate?: string;
    nextSessionDescription?: string;
    weekActivity?: string;
    motivationalPhrase?: string;
  };

  const [existing] = await db
    .select()
    .from(librosTable)
    .where(eq(librosTable.estatus, LIBRO_ESTATUS.ACTIVO))
    .orderBy(desc(librosTable.creadoEn))
    .limit(1);

  let book;
  if (existing) {
    const [updated] = await db
      .update(librosTable)
      .set({
        titulo: title,
        autor: author,
        genero: genre,
        coverUrl,
        sinopsis: synopsis,
      })
      .where(eq(librosTable.id, existing.id))
      .returning();
    book = updated;
  } else {
    const [created] = await db
      .insert(librosTable)
      .values({
        titulo: title,
        autor: author,
        genero: genre,
        coverUrl,
        sinopsis: synopsis,
        estatus: LIBRO_ESTATUS.ACTIVO,
      })
      .returning();
    book = created;
  }

  if (weekActivity !== undefined) {
    await upsertActividad(book.id, ACTIVIDAD_TIPO.CINE, weekActivity);
  }

  res.json(await mapLibroEnRuta(book));
});

router.post("/admin/literary-countries/:id/expeditions", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const countryId = parseInt(raw, 10);

  const { title, author, coverUrl, startDate, endDate, closingActivity, closingActivityDesc, description } =
    req.body as {
      title: string;
      author: string;
      coverUrl?: string;
      startDate?: string;
      endDate?: string;
      closingActivity?: string;
      closingActivityDesc?: string;
      description?: string;
    };

  const [expedition] = await db
    .insert(librosTable)
    .values({
      titulo: title,
      autor: author,
      coverUrl: coverUrl ?? "",
      sinopsis: description ?? "",
      genero: "Expedición",
      estatus: LIBRO_ESTATUS.TERMINADO,
      paisLiterario: countryId,
      fechaInicio: startDate ? startDate.slice(0, 10) : null,
      fechaFinal: endDate ? endDate.slice(0, 10) : null,
    })
    .returning();

  if (closingActivity && closingActivity !== "none") {
    await upsertActividad(
      expedition.id,
      ACTIVIDAD_TIPO.CINE,
      closingActivityDesc ?? closingActivity,
    );
  }

  res.json(await mapExpedicion(expedition));
});

router.put("/admin/expeditions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { title, author, coverUrl, startDate, endDate, closingActivity, closingActivityDesc, description } =
    req.body as Partial<{
      title: string;
      author: string;
      coverUrl: string;
      startDate: string;
      endDate: string;
      closingActivity: string;
      closingActivityDesc: string;
      description: string;
    }>;

  const data: Partial<typeof librosTable.$inferInsert> = {};
  if (title !== undefined) data.titulo = title;
  if (author !== undefined) data.autor = author;
  if (coverUrl !== undefined) data.coverUrl = coverUrl;
  if (startDate !== undefined) data.fechaInicio = startDate.slice(0, 10);
  if (endDate !== undefined) data.fechaFinal = endDate.slice(0, 10);
  if (description !== undefined) data.sinopsis = description;

  const [updated] = await db
    .update(librosTable)
    .set(data)
    .where(eq(librosTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Expedición no encontrada" });
    return;
  }

  if (closingActivity !== undefined) {
    if (closingActivity === "none") {
      await db
        .delete(actividadTable)
        .where(and(eq(actividadTable.libroId, id), eq(actividadTable.tipo, ACTIVIDAD_TIPO.CINE)));
    } else {
      await upsertActividad(
        id,
        ACTIVIDAD_TIPO.CINE,
        closingActivityDesc ?? closingActivity,
      );
    }
  }

  res.json(await mapExpedicion(updated));
});

router.delete("/admin/expeditions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(lectorasTable).where(eq(lectorasTable.librosId, id));
  await db.delete(actividadTable).where(eq(actividadTable.libroId, id));
  await db.delete(votacionTable).where(eq(votacionTable.libroId, id));
  await db.delete(librosTable).where(eq(librosTable.id, id));
  res.json({ success: true });
});

router.post("/admin/expeditions/:id/readers", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const expeditionId = parseInt(raw, 10);
  const { memberId } = req.body as { memberId: number };

  const existing = await db
    .select()
    .from(lectorasTable)
    .where(and(eq(lectorasTable.librosId, expeditionId), eq(lectorasTable.miembrosId, memberId)));

  if (existing.length > 0) {
    res.json({ success: true, message: "Ya registrado" });
    return;
  }

  const [row] = await db
    .insert(lectorasTable)
    .values({ librosId: expeditionId, miembrosId: memberId })
    .returning();

  res.json(row);
});

router.delete("/admin/expeditions/:id/readers/:memberId", async (req, res): Promise<void> => {
  const rawExp = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawMem = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const expeditionId = parseInt(rawExp, 10);
  const memberId = parseInt(rawMem, 10);

  await db
    .delete(lectorasTable)
    .where(
      and(
        eq(lectorasTable.librosId, expeditionId),
        eq(lectorasTable.miembrosId, memberId),
      ),
    );

  res.json({ success: true });
});

router.post("/admin/literary-countries/:id/gallery", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const countryId = parseInt(raw, 10);
  const { url, caption } = req.body as { url: string; caption?: string };

  const galeriaLibro = await getOrCreateGaleriaLibro(countryId);
  const [photo] = await db
    .insert(actividadTable)
    .values({
      libroId: galeriaLibro.id,
      tipo: ACTIVIDAD_TIPO.VISITA,
      descripcion: caption ?? "",
      fotoUrl: url,
    })
    .returning();

  res.json({
    id: photo.id,
    countryId,
    url: photo.fotoUrl ?? "",
    caption: photo.descripcion,
    displayOrder: photo.id,
    createdAt: formatTimestamp(photo.creadoEn),
  });
});

router.delete("/admin/gallery/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(actividadTable).where(eq(actividadTable.id, id));
  res.json({ success: true });
});

router.put("/admin/literary-countries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { name, emoji, description, color } = req.body as {
    name?: string;
    emoji?: string;
    description?: string;
    color?: string;
  };

  const updateData: Partial<typeof paisesLiterariosTable.$inferInsert> = {};
  if (name !== undefined) updateData.paisLiterario = name;
  if (emoji !== undefined) updateData.emoji = emoji;
  if (description !== undefined) updateData.descripcion = description;
  if (color !== undefined) updateData.color = color;

  const [updated] = await db
    .update(paisesLiterariosTable)
    .set(updateData)
    .where(eq(paisesLiterariosTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "País literario no encontrado" });
    return;
  }

  res.json(await mapPaisLiterario(updated, updated.id - 1));
});

export default router;
