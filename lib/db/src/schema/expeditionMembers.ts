import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { countryExpeditionsTable } from "./countryExpeditions";
import { membersTable } from "./members";

export const expeditionMembersTable = pgTable("expedition_members", {
  id: serial("id").primaryKey(),
  expeditionId: integer("expedition_id")
    .notNull()
    .references(() => countryExpeditionsTable.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => membersTable.id, { onDelete: "cascade" }),
});

export type ExpeditionMember = typeof expeditionMembersTable.$inferSelect;
