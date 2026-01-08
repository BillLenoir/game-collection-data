import { PrismaClient } from "@prisma/client";
import { logMessage } from "./log-messages";

const prisma = new PrismaClient();

export async function emptyDatabase() {
  const deleteRelationships =
    await prisma.entityGameRoleRelationship.deleteMany({});
  logMessage(
    "INFO",
    `Deleted RELATIONSHIPS: ${JSON.stringify(deleteRelationships)}`,
  );

  const deleteGame = await prisma.game.deleteMany({});
  logMessage("INFO", `Deleted GAMES: ${JSON.stringify(deleteGame)}`);

  const deleteEntities = await prisma.entity.deleteMany({});
  logMessage("INFO", `Deleted ENTITIES: ${JSON.stringify(deleteEntities)}`);
}

await emptyDatabase();
