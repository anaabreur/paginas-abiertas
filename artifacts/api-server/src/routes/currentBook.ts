import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  librosTable,
  LIBRO_ESTATUS,
  mapLibroEnRuta,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/current-book", async (_req, res): Promise<void> => {
  const [book] = await db
    .select()
    .from(librosTable)
    .where(eq(librosTable.estatus, LIBRO_ESTATUS.ACTIVO))
    .orderBy(desc(librosTable.creadoEn))
    .limit(1);

  res.json({
    book: book ? await mapLibroEnRuta(book) : null,
  });
});

export default router;
