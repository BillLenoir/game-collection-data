import fs from "fs/promises";
import convert from "xml-js";
import { getGameData } from "./get-game-data";
import { dataConfigs } from "./utils/data.config";
import {
  type BggCollectionData,
  type BggGameDataFromCollection,
  type DataResponse,
  type EntityData,
  type EntityGameDataSave,
  type GameData,
  type RelationshipData,
} from "./utils/data.types";
import { logMessage } from "./utils/log-messages";

const entitiesData: EntityData[] = [];
const relationshipsData: RelationshipData[] = [];
let idCount = 1;

// Helper function to handle file writing
async function writeToFile(path: string, data: string): Promise<void> {
  try {
    await fs.writeFile(path, data);
    logMessage("HAPPY", `File written: ${path}`);
  } catch (error) {
    logMessage(
      "ERROR",
      `Failed to write file ${path}`,
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Process individual game data
async function processGame(
  game: BggGameDataFromCollection,
): Promise<DataResponse> {
  const systemId = idCount++;
  const bggGameId = game._attributes.objectid ?? "";
  const gameTitle = game.name._text ?? "No title";
  const gameYearPublished = game.yearpublished?._text ?? "No year indicated";
  const gameThumbnail = game.thumbnail?._text ?? "No thumbnail";
  const gameOwn = game.status._attributes.own === "1";
  const gameWantToBuy = game.status._attributes.want === "1";
  const gamePrevOwned = game.status._attributes.prevowned === "1";
  const gameForTrade = game.status._attributes.fortrade === "1";

  const gameDataDirectory = `${dataConfigs.localData.dataDirectory}game-data/`;
  const rawResponseGameDataFile = `${gameDataDirectory}game-${bggGameId}.xml`;

  // Fetch additional game data
  let moreGameData;
  try {
    moreGameData = await getGameData(bggGameId);
    if (!moreGameData || moreGameData.successOrFailure === "FAIL") {
      logMessage(
        "ERROR",
        `Problem getting data for ${game.name}`,
        moreGameData.message,
      );
    }
  } catch (error) {
    logMessage("ERROR", `getGameData for ${game.name} failed.`, `${error}`);
  }

  // Create directory if it doesn't exist
  if (!(await fs.stat(gameDataDirectory).catch(() => false))) {
    await fs.mkdir(gameDataDirectory, { recursive: true });
  }

  try {
    if (moreGameData) {
      await fs.writeFile(rawResponseGameDataFile, moreGameData.data);
    } else {
      logMessage("ERROR", "There's no game data to write a file for!");
    }
  } catch (error) {
    logMessage(
      "ERROR",
      `Something happened when writing the file for ${gameTitle}`,
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // Convert and parse game data
  let convertedResponseGameData = "";
  if (moreGameData) {
    convertedResponseGameData = convert.xml2json(moreGameData.data, {
      compact: true,
      spaces: 2,
    });
  } else {
    logMessage("ERROR", "There's no game data to parse!");
  }
  const fullGameData = JSON.parse(convertedResponseGameData);
  const gameDescription =
    fullGameData.boardgames.boardgame.description?._text ?? "";

  processEntity(fullGameData.boardgames.boardgame, systemId);

  return {
    data: JSON.stringify({
      id: systemId,
      bggid: bggGameId,
      title: gameTitle,
      yearpublished: gameYearPublished,
      thumbnail: gameThumbnail,
      description: gameDescription,
      gameown: gameOwn,
      gamewanttobuy: gameWantToBuy,
      gameprevowned: gamePrevOwned,
      gamefortrade: gameForTrade,
    }),
    successOrFailure: "SUCCESS",
    message: "Game data processed successfully",
  };
}

function processEntity(
  gameData: BggGameDataFromCollection,
  gameId: number,
): void {
  const theseEntities: EntityData[] = [];
  for (const [key, value] of Object.entries(gameData)) {
    let relationshipType = "";
    switch (key) {
      case "boardgamepublisher":
        relationshipType = "Publisher";
        break;
      case "boardgamedesigner":
        relationshipType = "Designer";
        break;
      case "boardgamefamily":
        relationshipType = "Family";
        break;
    }
    if (relationshipType) {
      const bggEntities = Array.isArray(value) ? value : [value];
      for (const entity of bggEntities) {
        theseEntities.push({
          id: idCount++,
          bggid: entity._attributes.objectid,
          name: entity._text,
          type: entity.type,
        });
      }
    }
  }

  if (theseEntities.length > 0) {
    theseEntities.forEach((entity) => {
      if (
        entitiesData.some(
          (existingEntity) => existingEntity.bggid !== entity.bggid,
        )
      ) {
        entitiesData.push(entity);
      } else if (
        entitiesData.some(
          (existingEntity) =>
            existingEntity.bggid !== entity.bggid &&
            existingEntity.name !== entity.name,
        )
      ) {
        logMessage(
          "ERROR",
          "Two entities with same BGG ID, but different names!",
          `ID: ${entity.id}`,
        );
      }
      relationshipsData.push({
        gameId,
        entityId: entity.bggid,
        relationshiptype: entity.name,
      });
    });
  }
}

export async function formatCollectionData(
  rawCollectionData: string,
): Promise<DataResponse> {
  const convertedResponse = convert.xml2json(rawCollectionData, {
    compact: true,
    spaces: 2,
  });
  const collectionData: BggCollectionData = JSON.parse(convertedResponse);
  logMessage("HAPPY", "XML response from BGG converted to JSON!");
  logMessage("INFO", "Begin processing the games...");

  const gameDataRequest: Array<Promise<DataResponse>> = [];

  // Process games concurrently using Promise.all
  for (const game of collectionData.items.item) {
    if (
      game.status._attributes.own === "1" ||
      game.status._attributes.want === "1" ||
      game.status._attributes.prevowned === "1" ||
      game.status._attributes.fortrade === "1"
    ) {
      gameDataRequest.push(processGame(game));
    } else {
      logMessage("WARNING", `-- This game doesn't count: ${game.name._text}`);
    }
  }

  let gameDataResponse;
  try {
    gameDataResponse = await Promise.allSettled(gameDataRequest);
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: "Game processing failed!",
    };
  }
  const gamesData: GameData[] = gameDataResponse
    .filter(
      (result): result is PromiseFulfilledResult<DataResponse> =>
        result.status === "fulfilled",
    )
    .map((result) => JSON.parse(result.value.data));
  gameDataResponse
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    )
    .forEach((result) =>
      logMessage("ERROR", "Game processing failed", result.reason),
    );

  // Further processing or file writing can be done here based on gameResults
  const writableGameData = JSON.stringify(gamesData);
  const writableEntityData = JSON.stringify(entitiesData);
  const writableRelationshipData = JSON.stringify(relationshipsData);
  const filesToWrite: Array<Promise<void>> = [];
  filesToWrite.push(
    writeToFile(dataConfigs.localData.gameDataFile, writableGameData),
    writeToFile(dataConfigs.localData.gameDataFile, writableEntityData),
    writeToFile(dataConfigs.localData.entityDataFile, writableRelationshipData),
  );
  await Promise.all(filesToWrite);

  const entityGameData: EntityGameDataSave = {
    gamedata: gamesData,
    entitydata: entitiesData,
    relationshipdata: relationshipsData,
  };

  logMessage("HAPPY", "Finished processing and saving game data!");
  return {
    data: JSON.stringify(entityGameData),
    successOrFailure: "SUCCESS",
    message: "Formatted collection data successfully",
  };
}
