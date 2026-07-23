import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, miembrosTable, mapMiembro } from "@workspace/db";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res): Promise<void> => {
  try {
    const members = await db
      .select()
      .from(miembrosTable)
      .where(eq(miembrosTable.activa, true))
      .orderBy(desc(miembrosTable.puntos));

    res.json(members.map((member, index) => mapMiembro(member, index + 1)));
  } catch (error: any) {
    console.error("LEADERBOARD ERROR:", error.message);
    console.error("CAUSE:", error.cause?.message || "no cause");
    res.status(500).json({ error: error.message, cause: error.cause?.message || "unknown" });
  }
});

router.post("/members/register", async (req, res): Promise<void> => {
  try {
    const { alias, avatar } = req.body;
    if (!alias || !avatar) {
      res.status(400).json({ error: "Alias y avatar son requeridos" });
      return;
    }
    const [member] = await db
      .insert(miembrosTable)
      .values({ alias, avatar, puntos: 0, ranking: "Novata", activa: true })
      .returning();
    res.json(member);
  } catch (error: any) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;