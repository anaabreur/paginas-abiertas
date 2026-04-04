import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { getRank } from "../lib/nanoid";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const members = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.archived, false))
    .orderBy(desc(membersTable.points));

  const ranked = members.map((m, idx) => ({
    ...m,
    rank: getRank(m.points),
    position: idx + 1,
    createdAt: m.createdAt.toISOString(),
  }));

  res.json(ranked);
});

export default router;
