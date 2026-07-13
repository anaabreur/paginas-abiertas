import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  codigosVotacionTable,
  votacionTable,
  getActiveSesionVotacion,
  getLatestSesionVotacion,
  getCandidatosForSesion,
  getVoteCounts,
  mapSesionVotacion,
  mapLibroCandidato,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/voting/session", async (_req, res): Promise<void> => {
  const session = (await getActiveSesionVotacion()) ?? (await getLatestSesionVotacion());
  res.json({
    session: session ? mapSesionVotacion(session) : null,
  });
});

router.get("/voting/books", async (_req, res): Promise<void> => {
  const session = await getActiveSesionVotacion();
  if (!session) {
    res.json([]);
    return;
  }

  const books = await getCandidatosForSesion(session.creadoEn);
  const voteCounts = await getVoteCounts(session.id);
  const maxVotes = Math.max(0, ...books.map((book) => voteCounts.get(book.id) ?? 0));

  res.json(
    books
      .map((book) =>
        mapLibroCandidato(
          book,
          session.id,
          voteCounts.get(book.id) ?? 0,
          !session.abierto && (voteCounts.get(book.id) ?? 0) === maxVotes && maxVotes > 0,
        ),
      )
      .sort((a, b) => b.votes - a.votes),
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

  const session = await getActiveSesionVotacion();
  if (!session) {
    res.status(400).json({ message: "No hay votación activa" });
    return;
  }

  if (!session.abierto) {
    res.status(400).json({ message: "La votación está cerrada" });
    return;
  }

  const [votingCode] = await db
    .select()
    .from(codigosVotacionTable)
    .where(eq(codigosVotacionTable.codigo, code.trim().toUpperCase()));

  if (!votingCode) {
    res.status(400).json({ message: "Código inválido. Verifica que lo escribiste correctamente." });
    return;
  }

  if (votingCode.usado) {
    res.status(400).json({ message: "Este código ya fue utilizado." });
    return;
  }

  if (votingCode.sesionId !== session.id) {
    res.status(400).json({ message: "Este código no es válido para la votación actual." });
    return;
  }

  const books = await getCandidatosForSesion(session.creadoEn);
  const bookIds = books.map((book) => book.id);

  if (!bookIds.includes(bookId)) {
    res.status(400).json({ message: "Libro no encontrado en esta votación." });
    return;
  }

  const votesToInsert: Array<{
    codigoId: number;
    libroId: number;
    sesionId: number;
  }> = [{ codigoId: votingCode.id, libroId: bookId, sesionId: session.id }];

  let votesUsed = 1;

  if (votingCode.tipo === "premium" && secondBookId) {
    if (bookIds.includes(secondBookId)) {
      votesToInsert.push({
        codigoId: votingCode.id,
        libroId: secondBookId,
        sesionId: session.id,
      });
      votesUsed = 2;
    }
  } else if (votingCode.tipo === "premium" && !secondBookId) {
    votesToInsert.push({
      codigoId: votingCode.id,
      libroId: bookId,
      sesionId: session.id,
    });
    votesUsed = 2;
  }

  await db.insert(votacionTable).values(votesToInsert);
  await db
    .update(codigosVotacionTable)
    .set({ usado: true })
    .where(eq(codigosVotacionTable.id, votingCode.id));

  res.json({ success: true, message: "¡Voto registrado con éxito!", votesUsed });
});

export default router;
