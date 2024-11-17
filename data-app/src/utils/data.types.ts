import { z } from "zod";

// ENUMS
export const SuccessOrFailureZ = z.enum(["SUCCESS", "FAIL"]);
export type SuccessOrFailure = z.infer<typeof SuccessOrFailureZ>;

export const LogMessageTypeZ = z.enum(["ERROR", "HAPPY", "INFO", "WARNING"]);
export type LogMessageType = z.infer<typeof LogMessageTypeZ>;

// SYSTEM COMMUNICATION TYPES
export const DataPrepConfigsZ = z.object({
  bggUser: z.string(),
  needToFetch: z.boolean(),
  whereToSave: z.enum(["Locally", "S3"]),
  localData: z.object({
    dataDirectory: z.string(),
    rawResponseFile: z.string(),
    gameDataFile: z.string(),
    entityDataFile: z.string(),
    roleDataFile: z.string(),
    relationshipDataFile: z.string(),
  }),
});
export type DataPrepConfigs = z.infer<typeof DataPrepConfigsZ>;

export const DataResponseZ = z.object({
  data: z.string(),
  successOrFailure: SuccessOrFailureZ,
  message: z.string(),
});
export type DataResponse = z.infer<typeof DataResponseZ>;

export const ExtractedEntityZ = z.object({
  id: z.string(),
  bggId: z.string(),
  name: z.string(),
  role: z.string(),
  existingEntity: z.boolean(),
});
export type ExtractedEntity = z.infer<typeof ExtractedEntityZ>;

export const ExtractedEntitiesZ = z.array(ExtractedEntityZ);
export type ExtractedEntities = z.infer<typeof ExtractedEntitiesZ>;

// INTERNAL DATA TYPES
export const EntityDataZ = z.object({
  id: z.string(),
  bggId: z.string(),
  name: z.string(),
});
export type EntityData = z.infer<typeof EntityDataZ>;

export const GameDataZ = z.object({
  id: z.string(),
  bggId: z.string(),
  title: z.string(),
  yearpublished: z.string(),
  thumbnail: z.string(),
  description: z.string(),
  gameown: z.boolean(),
  gamewanttobuy: z.boolean(),
  gameprevowned: z.boolean(),
  gamefortrade: z.boolean(),
});
export type GameData = z.infer<typeof GameDataZ>;

export const RoleDataZ = z.object({
  id: z.string(),
  name: z.string(),
});
export type RoleData = z.infer<typeof RoleDataZ>;

export const RelationshipDataZ = z.object({
  gameId: z.string(),
  entityId: z.string(),
  roleId: z.string(),
});
export type RelationshipData = z.infer<typeof RelationshipDataZ>;

export const EntityGameDataSaveZ = z.object({
  gameData: z.array(GameDataZ),
  entityData: z.array(EntityDataZ),
  roleData: z.array(RoleDataZ),
  relationshipData: z.array(RelationshipDataZ),
});
export type EntityGameDataSave = z.infer<typeof EntityGameDataSaveZ>;
