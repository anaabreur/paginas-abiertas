import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  votingSessionsTable,
  candidateBooksTable,
  votingCodesTable,
  membersTable,
  currentBooksTable,
  literaryCountriesTable,
  countryExpeditionsTable,
  expeditionMembersTable,
  countryGalleryTable,
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
    .insert(votingSessionsTable)
    .values({
      title,
      status: "open",
      deadline: deadline ? new Date(deadline) : null,
    })
    .returning();

  res.json({
    ...session,
    deadline: session.deadline?.toISOString() ?? null,
    createdAt: session.createdAt.toISOString(),
  });
});

router.post("/admin/voting/session/:id/close", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .where(eq(votingSessionsTable.id, id));

  if (!sessions[0]) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  const books = await db
    .select()
    .from(candidateBooksTable)
    .where(eq(candidateBooksTable.sessionId, id))
    .orderBy(desc(candidateBooksTable.votes));

  if (books.length > 0 && books[0]) {
    await db
      .update(candidateBooksTable)
      .set({ isWinner: true })
      .where(eq(candidateBooksTable.id, books[0].id));
  }

  const [updated] = await db
    .update(votingSessionsTable)
    .set({ status: "closed" })
    .where(eq(votingSessionsTable.id, id))
    .returning();

  res.json({
    ...updated,
    deadline: updated.deadline?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.post("/admin/voting/session/:id/open", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [updated] = await db
    .update(votingSessionsTable)
    .set({ status: "open" })
    .where(eq(votingSessionsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  res.json({
    ...updated,
    deadline: updated.deadline?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.put("/admin/voting/session/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { deadline } = req.body as { deadline?: string | null };

  const [updated] = await db
    .update(votingSessionsTable)
    .set({ deadline: deadline ? new Date(deadline) : null })
    .where(eq(votingSessionsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Sesión no encontrada" });
    return;
  }

  res.json({
    ...updated,
    deadline: updated.deadline?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.post("/admin/voting/books", async (req, res): Promise<void> => {
  const { title, author, genre, coverUrl, synopsis } = req.body as {
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    synopsis: string;
  };

  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  if (!sessions[0]) {
    res.status(400).json({ message: "No hay sesión de votación activa" });
    return;
  }

  const [book] = await db
    .insert(candidateBooksTable)
    .values({
      sessionId: sessions[0].id,
      title,
      author,
      genre,
      coverUrl,
      synopsis,
    })
    .returning();

  res.json({
    ...book,
    createdAt: book.createdAt.toISOString(),
  });
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

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (author !== undefined) data.author = author;
  if (genre !== undefined) data.genre = genre;
  if (coverUrl !== undefined) data.coverUrl = coverUrl;
  if (synopsis !== undefined) data.synopsis = synopsis;
  if (isWinner !== undefined) data.isWinner = isWinner;

  const [updated] = await db
    .update(candidateBooksTable)
    .set(data)
    .where(eq(candidateBooksTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Libro no encontrado" });
    return;
  }

  res.json({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.delete("/admin/voting/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db
    .delete(candidateBooksTable)
    .where(eq(candidateBooksTable.id, id));

  res.json({ success: true });
});

router.get("/admin/voting/codes", async (req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  if (!sessions[0]) {
    res.json([]);
    return;
  }

  const codes = await db
    .select()
    .from(votingCodesTable)
    .where(eq(votingCodesTable.sessionId, sessions[0].id));

  res.json(
    codes.map((c) => ({
      ...c,
      usedAt: c.usedAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.delete("/admin/voting/codes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db
    .delete(votingCodesTable)
    .where(eq(votingCodesTable.id, id))
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

  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  if (!sessions[0]) {
    res.status(400).json({ message: "No hay sesión de votación activa" });
    return;
  }

  const existingCodes = await db
    .select()
    .from(votingCodesTable);
  const existingSet = new Set(existingCodes.map((c) => c.code));

  const newCodes: { sessionId: number; code: string; type: string }[] = [];
  let attempts = 0;
  while (newCodes.length < quantity && attempts < 1000) {
    const code = generateCode(8);
    if (!existingSet.has(code)) {
      existingSet.add(code);
      newCodes.push({ sessionId: sessions[0].id, code, type });
    }
    attempts++;
  }

  const inserted = await db
    .insert(votingCodesTable)
    .values(newCodes)
    .returning();

  res.json(
    inserted.map((c) => ({
      ...c,
      usedAt: null,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.get("/admin/leaderboard", async (req, res): Promise<void> => {
  const members = await db
    .select()
    .from(membersTable)
    .orderBy(desc(membersTable.points));

  const ranked = members.map((m, idx) => ({
    ...m,
    rank: getRank(m.points),
    position: idx + 1,
    createdAt: m.createdAt.toISOString(),
  }));

  res.json(ranked);
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

  const [member] = await db
    .insert(membersTable)
    .values({ alias, avatar, points: points ?? 0 })
    .returning();

  const allMembers = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.archived, false))
    .orderBy(desc(membersTable.points));

  const position = allMembers.findIndex((m) => m.id === member.id) + 1;

  res.json({
    ...member,
    rank: getRank(member.points),
    position,
    createdAt: member.createdAt.toISOString(),
  });
});

router.put("/admin/leaderboard/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { alias, avatar, points } = req.body as {
    alias?: string;
    avatar?: string;
    points?: number;
  };

  const updateData: Partial<{ alias: string; avatar: string; points: number }> = {};
  if (alias !== undefined) updateData.alias = alias;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (points !== undefined) updateData.points = points;

  const [updated] = await db
    .update(membersTable)
    .set(updateData)
    .where(eq(membersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Miembro no encontrado" });
    return;
  }

  const allMembers = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.archived, false))
    .orderBy(desc(membersTable.points));

  const position = allMembers.findIndex((m) => m.id === updated.id) + 1;

  res.json({
    ...updated,
    rank: getRank(updated.points),
    position: position > 0 ? position : 0,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.delete("/admin/members/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db
    .delete(membersTable)
    .where(eq(membersTable.id, id))
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
    .update(membersTable)
    .set({ archived: true })
    .where(eq(membersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Miembro no encontrado" });
    return;
  }

  res.json({
    ...updated,
    rank: getRank(updated.points),
    position: 0,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.put("/admin/current-book", async (req, res): Promise<void> => {
  const {
    title,
    author,
    genre,
    coverUrl,
    synopsis,
    currentWeek,
    totalWeeks,
    nextSessionDate,
    nextSessionDescription,
    weekActivity,
    motivationalPhrase,
  } = req.body as {
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    synopsis: string;
    currentWeek: number;
    totalWeeks: number;
    nextSessionDate: string;
    nextSessionDescription: string;
    weekActivity: string;
    motivationalPhrase: string;
  };

  const existing = await db
    .select()
    .from(currentBooksTable)
    .orderBy(desc(currentBooksTable.updatedAt))
    .limit(1);

  const data = {
    title,
    author,
    genre,
    coverUrl,
    synopsis,
    currentWeek,
    totalWeeks,
    nextSessionDate,
    nextSessionDescription,
    weekActivity,
    motivationalPhrase,
  };

  let book;
  if (existing[0]) {
    const [updated] = await db
      .update(currentBooksTable)
      .set(data)
      .where(eq(currentBooksTable.id, existing[0].id))
      .returning();
    book = updated;
  } else {
    const [created] = await db
      .insert(currentBooksTable)
      .values(data)
      .returning();
    book = created;
  }

  res.json({
    ...book,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  });
});

// ── EXPEDITION ROUTES ───────────────────────────────────────────────────────

router.post("/admin/literary-countries/:id/expeditions", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const countryId = parseInt(raw, 10);

  const { title, author, coverUrl, startDate, endDate, closingActivity, closingActivityDesc, description, displayOrder } =
    req.body as {
      title: string;
      author: string;
      coverUrl?: string;
      startDate?: string;
      endDate?: string;
      closingActivity?: string;
      closingActivityDesc?: string;
      description?: string;
      displayOrder?: number;
    };

  const [expedition] = await db
    .insert(countryExpeditionsTable)
    .values({
      countryId,
      title,
      author,
      coverUrl: coverUrl ?? "",
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      closingActivity: closingActivity ?? "none",
      closingActivityDesc: closingActivityDesc ?? "",
      description: description ?? "",
      displayOrder: displayOrder ?? 0,
    })
    .returning();

  res.json({ ...expedition, createdAt: expedition.createdAt.toISOString(), readers: [] });
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

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (author !== undefined) data.author = author;
  if (coverUrl !== undefined) data.coverUrl = coverUrl;
  if (startDate !== undefined) data.startDate = startDate;
  if (endDate !== undefined) data.endDate = endDate;
  if (closingActivity !== undefined) data.closingActivity = closingActivity;
  if (closingActivityDesc !== undefined) data.closingActivityDesc = closingActivityDesc;
  if (description !== undefined) data.description = description;

  const [updated] = await db
    .update(countryExpeditionsTable)
    .set(data)
    .where(eq(countryExpeditionsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "Expedición no encontrada" });
    return;
  }

  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

router.delete("/admin/expeditions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(countryExpeditionsTable).where(eq(countryExpeditionsTable.id, id));
  res.json({ success: true });
});

router.post("/admin/expeditions/:id/readers", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const expeditionId = parseInt(raw, 10);
  const { memberId } = req.body as { memberId: number };

  const existing = await db
    .select()
    .from(expeditionMembersTable)
    .where(eq(expeditionMembersTable.expeditionId, expeditionId));

  if (existing.some((r) => r.memberId === memberId)) {
    res.json({ success: true, message: "Ya registrado" });
    return;
  }

  const [row] = await db
    .insert(expeditionMembersTable)
    .values({ expeditionId, memberId })
    .returning();

  res.json(row);
});

router.delete("/admin/expeditions/:id/readers/:memberId", async (req, res): Promise<void> => {
  const rawExp = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawMem = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const expeditionId = parseInt(rawExp, 10);
  const memberId = parseInt(rawMem, 10);

  await db
    .delete(expeditionMembersTable)
    .where(
      eq(expeditionMembersTable.expeditionId, expeditionId)
    );

  res.json({ success: true });
});

// ── GALLERY ROUTES ───────────────────────────────────────────────────────────

router.post("/admin/literary-countries/:id/gallery", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const countryId = parseInt(raw, 10);
  const { url, caption, displayOrder } = req.body as { url: string; caption?: string; displayOrder?: number };

  const [photo] = await db
    .insert(countryGalleryTable)
    .values({ countryId, url, caption: caption ?? "", displayOrder: displayOrder ?? 0 })
    .returning();

  res.json({ ...photo, createdAt: photo.createdAt.toISOString() });
});

router.delete("/admin/gallery/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(countryGalleryTable).where(eq(countryGalleryTable.id, id));
  res.json({ success: true });
});

// ── LITERARY COUNTRY UPDATE ──────────────────────────────────────────────────

router.put("/admin/literary-countries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { name, emoji, description, color, booksRead } = req.body as {
    name?: string;
    emoji?: string;
    description?: string;
    color?: string;
    booksRead?: number;
  };

  const updateData: Partial<{ name: string; emoji: string; description: string; color: string; booksRead: number; updatedAt: Date }> = {};
  if (name !== undefined) updateData.name = name;
  if (emoji !== undefined) updateData.emoji = emoji;
  if (description !== undefined) updateData.description = description;
  if (color !== undefined) updateData.color = color;
  if (booksRead !== undefined) updateData.booksRead = booksRead;
  updateData.updatedAt = new Date();

  const [updated] = await db
    .update(literaryCountriesTable)
    .set(updateData)
    .where(eq(literaryCountriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ message: "País literario no encontrado" });
    return;
  }

  res.json({ ...updated, updatedAt: updated.updatedAt.toISOString() });
});

export default router;
