import { z } from "zod";

const CursorZ = z.object({
  i: z.nullable(z.string()),
  l: z.number(),
  s: z.enum(["id", "title", "yearpublished"]),
  f: z.enum(["gameown", "gameprevowned", "gamewanttobuy"]),
});
export type Cursor = z.infer<typeof CursorZ>;

// Types for data returned from database
const DbReturnedEntityZ = z.object({
  id: z.string(),
  bggid: z.string(),
  name: z.string(),
});
export type DbReturnedEntity = z.infer<typeof DbReturnedEntityZ>;

const DbReturnedRoleZ = z.object({
  id: z.string(),
  name: z.string(),
});
export type ReturnedRole = z.infer<typeof DbReturnedRoleZ>;

const DbReturnedRelationshipZ = z.object({
  gameid: z.string(),
  entityid: z.string(),
  roleid: z.string(),
  entity: DbReturnedEntityZ,
  role: DbReturnedRoleZ,
});
export type DbReturnedRelationship = z.infer<typeof DbReturnedRelationshipZ>;

const DbReturnedGameZ = z.object({
  id: z.string(),
  bggid: z.string(),
  title: z.string(),
  yearpublished: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  description: z.string(),
  gameown: z.boolean(),
  gamewanttobuy: z.boolean(),
  gameprevowned: z.boolean(),
  gamefortrade: z.boolean(),
  entities: z.array(DbReturnedRelationshipZ),
});
export type DbReturnedGame = z.infer<typeof DbReturnedGameZ>;
