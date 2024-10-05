import { PrismaClient } from "@prisma/client";
import type {
  DataResponse,
  EntityGameDataSave,
  GameData,
} from "./utils/data.types";
import { logMessage } from "./utils/log-messages";

const prisma = new PrismaClient();

export async function hydrateDatabase(
  collectionData: string,
): Promise<DataResponse> {
  const deleteRelationships = await prisma.entityGameRelationship.deleteMany(
    {},
  );
  logMessage("INFO", `${JSON.stringify(deleteRelationships)}`);

  const deleteGame = await prisma.game.deleteMany({});
  logMessage("INFO", `${JSON.stringify(deleteGame)}`);

  const deleteEntities = await prisma.entity.deleteMany({});
  logMessage("INFO", `${JSON.stringify(deleteEntities)}`);

  const parsedCollectionData: EntityGameDataSave = JSON.parse(collectionData);
  const insertedGames = await insertGames(parsedCollectionData.gamedata);
  if (!insertedGames || insertedGames.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `formatCollectionData Failed! ${insertedGames.message}`,
    };
  }

  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: "Successfully hydrated the database!",
  };
}

const insertGames = async (games: GameData[]): Promise<DataResponse> => {
  const gamesInserted = [];
  for (const game of games) {
    const hydrateGames = await prisma.game.create({
      data: {
        id: game.id,
        bggid: game.bggid,
        title: game.title,
        yearpublished: game.yearpublished,
        thumbnail: game.thumbnail,
        description: game.description,
        gameown: game.gameown,
        gamewanttobuy: game.gamewanttobuy,
        gameprevowned: game.gameprevowned,
        gamefortrade: game.gamefortrade,
      },
    });
    gamesInserted.push(hydrateGames);
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: `Number of games inserted: ${gamesInserted.length}`,
  };
};
