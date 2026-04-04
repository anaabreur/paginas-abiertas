import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, literaryCountriesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/literary-countries", async (req, res): Promise<void> => {
  const countries = await db
    .select()
    .from(literaryCountriesTable)
    .orderBy(asc(literaryCountriesTable.displayOrder));

  res.json(
    countries.map((c) => ({
      ...c,
      updatedAt: c.updatedAt.toISOString(),
    }))
  );
});

export default router;
