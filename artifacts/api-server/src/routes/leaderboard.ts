import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, miembrosTable, mapMiembro } from "@workspace/db";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res): Promise<void> => {
  const members = await db
    .select()
    .from(miembrosTable)
    .where(eq(miembrosTable.activa, true))
    .orderBy(desc(miembrosTable.puntos));

  res.json(members.map((member, index) => mapMiembro(member, index + 1)));
});

export default router;
