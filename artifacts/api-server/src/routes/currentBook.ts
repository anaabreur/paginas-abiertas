import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, currentBooksTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/current-book", async (req, res): Promise<void> => {
  const books = await db
    .select()
    .from(currentBooksTable)
    .orderBy(desc(currentBooksTable.updatedAt))
    .limit(1);

  const book = books[0] ?? null;
  res.json({
    book: book
      ? {
          ...book,
          createdAt: book.createdAt.toISOString(),
          updatedAt: book.updatedAt.toISOString(),
        }
      : null,
  });
});

export default router;
