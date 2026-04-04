import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  db,
  literaryCountriesTable,
  countryExpeditionsTable,
  expeditionMembersTable,
  membersTable,
  countryGalleryTable,
} from "@workspace/db";

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

router.get("/literary-countries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [country] = await db
    .select()
    .from(literaryCountriesTable)
    .where(eq(literaryCountriesTable.id, id));

  if (!country) {
    res.status(404).json({ message: "País literario no encontrado" });
    return;
  }

  res.json({ ...country, updatedAt: country.updatedAt.toISOString() });
});

router.get("/literary-countries/:id/expeditions", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const expeditions = await db
    .select()
    .from(countryExpeditionsTable)
    .where(eq(countryExpeditionsTable.countryId, id))
    .orderBy(asc(countryExpeditionsTable.displayOrder));

  const result = await Promise.all(
    expeditions.map(async (exp) => {
      const readerRows = await db
        .select({ member: membersTable })
        .from(expeditionMembersTable)
        .innerJoin(membersTable, eq(expeditionMembersTable.memberId, membersTable.id))
        .where(eq(expeditionMembersTable.expeditionId, exp.id));

      return {
        ...exp,
        createdAt: exp.createdAt.toISOString(),
        readers: readerRows.map((r) => ({
          id: r.member.id,
          alias: r.member.alias,
          avatar: r.member.avatar,
        })),
      };
    })
  );

  res.json(result);
});

router.get("/literary-countries/:id/gallery", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const photos = await db
    .select()
    .from(countryGalleryTable)
    .where(eq(countryGalleryTable.countryId, id))
    .orderBy(asc(countryGalleryTable.displayOrder));

  res.json(
    photos.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

export default router;
