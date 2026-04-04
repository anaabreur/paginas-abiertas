import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, votingSessionsTable, candidateBooksTable, votingCodesTable } from "@workspace/db";
import { generateCode } from "../lib/nanoid";

const router: IRouter = Router();

router.get("/voting/session", async (req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  const session = sessions[0] ?? null;
  res.json({
    session: session
      ? {
          ...session,
          deadline: session.deadline?.toISOString() ?? null,
          createdAt: session.createdAt.toISOString(),
        }
      : null,
  });
});

router.get("/voting/books", async (req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  if (!sessions[0]) {
    res.json([]);
    return;
  }

  const books = await db
    .select()
    .from(candidateBooksTable)
    .where(eq(candidateBooksTable.sessionId, sessions[0].id))
    .orderBy(desc(candidateBooksTable.votes));

  res.json(
    books.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    }))
  );
});

router.post("/voting/vote", async (req, res): Promise<void> => {
  const { code, bookId, secondBookId } = req.body as {
    code: string;
    bookId: number;
    secondBookId?: number;
  };

  if (!code || !bookId) {
    res.status(400).json({ message: "Código y libro requeridos" });
    return;
  }

  const sessions = await db
    .select()
    .from(votingSessionsTable)
    .orderBy(desc(votingSessionsTable.createdAt))
    .limit(1);

  const session = sessions[0];
  if (!session) {
    res.status(400).json({ message: "No hay votación activa" });
    return;
  }

  if (session.status === "closed") {
    res.status(400).json({ message: "La votación está cerrada" });
    return;
  }

  const codes = await db
    .select()
    .from(votingCodesTable)
    .where(eq(votingCodesTable.code, code.trim().toUpperCase()));

  const votingCode = codes[0];
  if (!votingCode) {
    res.status(400).json({ message: "Código inválido. Verifica que lo escribiste correctamente." });
    return;
  }

  if (votingCode.used) {
    res.status(400).json({ message: "Este código ya fue utilizado." });
    return;
  }

  if (votingCode.sessionId !== session.id) {
    res.status(400).json({ message: "Este código no es válido para la votación actual." });
    return;
  }

  const books = await db
    .select()
    .from(candidateBooksTable)
    .where(eq(candidateBooksTable.sessionId, session.id));

  const bookIds = books.map((b) => b.id);
  if (!bookIds.includes(bookId)) {
    res.status(400).json({ message: "Libro no encontrado en esta votación." });
    return;
  }

  await db
    .update(candidateBooksTable)
    .set({ votes: (books.find((b) => b.id === bookId)?.votes ?? 0) + 1 })
    .where(eq(candidateBooksTable.id, bookId));

  let votesUsed = 1;

  if (votingCode.type === "premium" && secondBookId) {
    if (bookIds.includes(secondBookId)) {
      const secondBook = books.find((b) => b.id === secondBookId);
      await db
        .update(candidateBooksTable)
        .set({ votes: (secondBook?.votes ?? 0) + 1 })
        .where(eq(candidateBooksTable.id, secondBookId));
      votesUsed = 2;
    }
  } else if (votingCode.type === "premium" && !secondBookId) {
    await db
      .update(candidateBooksTable)
      .set({ votes: (books.find((b) => b.id === bookId)?.votes ?? 0) + 2 })
      .where(eq(candidateBooksTable.id, bookId));
    votesUsed = 2;
  }

  await db
    .update(votingCodesTable)
    .set({ used: true, usedAt: new Date() })
    .where(eq(votingCodesTable.id, votingCode.id));

  res.json({ success: true, message: "¡Voto registrado con éxito!", votesUsed });
});

export default router;
