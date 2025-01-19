import fs from "fs/promises";
import convert from "xml-js";
import { getGameData } from "./get-game-data";
import { dataConfigs } from "./utils/data.config";
import {
  type BggGameDataFromSingleCallJustTheGame,
  type ExtractedEntities,
  type BggCollectionData,
  type BggGameDataFromCollection,
  type DataResponse,
  type EntityData,
  type EntityGameDataSave,
  type GameData,
  type RelationshipData,
  type RoleData,
} from "./utils/data.types";
import { logMessage } from "./utils/log-messages";
import { writeToFile } from "./utils/write-to-file";

const entityData: EntityData[] = [];
const roleData: RoleData[] = [];
const relationshipData: RelationshipData[] = [];
let idCount = 1;

async function processBatch(
  requests: Array<Promise<DataResponse>>,
  gameData: GameData[],
): Promise<{ data: string; successOrFailure: string; message: string } | void> {
  let gameDataResponse;

  try {
    gameDataResponse = await Promise.allSettled(requests);
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: "Processing of individual game promises failed!",
    };
  }

  for (let j = 0; j < gameDataResponse.length; j++) {
    if (gameDataResponse[j]?.status === "fulfilled") {
      try {
        const thisGameDataResponse = gameDataResponse[
          j
        ] as PromiseFulfilledResult<DataResponse>;
        if (thisGameDataResponse.value.data) {
          gameData.push(JSON.parse(thisGameDataResponse.value.data));
        }
      } catch (error) {
        logMessage(
          "ERROR",
          `Error pushing: \n${error}\n${JSON.stringify(gameDataResponse[j])}\n\n`,
        );
      }
    }
  }

  gameDataResponse
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    )
    .forEach((result) =>
      logMessage(
        "ERROR",
        `Game processing failed for game ${result}. Reason:`,
        result.reason,
      ),
    );
}

// Process individual game data
export async function processGame(
  game: BggGameDataFromCollection,
): Promise<DataResponse> {
  const id = `${idCount++}`;
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
    let thisMessage = `Problem getting data for ${gameTitle}.`;
    if (moreGameData.message && thisMessage !== moreGameData.message) {
      thisMessage += `\n${moreGameData.message}`;
    }
    if (!moreGameData || moreGameData.successOrFailure === "FAIL") {
      return {
        data: "",
        successOrFailure: "FAIL",
        message: thisMessage,
      };
    }
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `getGameData for ${gameTitle} failed.\nMESSAGE: ${error}`,
    };
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

  const entities = extractAndProcessEntities(fullGameData.boardgames.boardgame);
  for (const entity of entities) {
    const role = processRoles(entity.role);
    relationshipData.push({
      gameId: id,
      entityId: entity.id,
      roleId: role.id,
    });
  }

  return {
    data: JSON.stringify({
      id,
      bggId: bggGameId,
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

export function extractAndProcessEntities(
  gameData: BggGameDataFromSingleCallJustTheGame,
): ExtractedEntities {
  let theseEntities = [];
  for (const [key, value] of Object.entries(gameData)) {
    let roleName;
    switch (key) {
      case "boardgameartist":
        roleName = "Artist";
        break;
      case "boardgamecategory":
        roleName = "Category";
        break;
      case "boardgamedesigner":
        roleName = "Designer";
        break;
      case "boardgamedeveloper":
        roleName = "Developer";
        break;
      case "boardgamefamily":
        roleName = "Family";
        break;
      case "boardgamemechanic":
        roleName = "Mechanic";
        break;
      case "boardgamepublisher":
        roleName = "Publisher";
        break;
      case "boardgamesubdomain":
        roleName = "Subdomain";
        break;
    }
    // Only process the data if a role name was found
    if (roleName) {
      // Processing Entities
      const possibleBggEntities = Array.isArray(value) ? value : [value];
      for (const entity of possibleBggEntities) {
        const foundEntity = entityData.find(
          (existingEntity) =>
            existingEntity.bggId === entity._attributes.objectid &&
            existingEntity.name === entity._text,
        );
        const thisEntity = {
          id: foundEntity?.id ? foundEntity.id : `${idCount++}`,
          bggId: entity._attributes.objectid,
          name: entity._text || "No name found",
          role: roleName,
          existingEntity: foundEntity ? true : false,
        };
        theseEntities.push(thisEntity);
        if (!foundEntity) {
          entityData.push({
            id: thisEntity.id,
            bggId: thisEntity.bggId,
            name: thisEntity.name,
          });
        }
      }
    }
  }

  return theseEntities;
}

export function processRoles(role: string): RoleData {
  const foundRole = roleData.find((existingRole) => existingRole.name === role);
  const thisRole: RoleData = {
    id: foundRole?.id ? foundRole.id : `${idCount++}`,
    name: role,
  };
  if (!foundRole) {
    // This is a new role
    roleData.push(thisRole);
  }
  return thisRole;
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
  let gameData: GameData[] = [];
  const batchedGames = 60;
  let gameCount = 1;
  logMessage("INFO", `Number of Games: ${collectionData.items.item.length}`);

  for (const game of collectionData.items.item) {
    if (gameCount === 1) {
      gameDataRequest.length = 0; // Reset the batch
    }

    gameDataRequest.push(processGame(game));

    if (gameCount === batchedGames) {
      // Process the full batch
      await processBatch(gameDataRequest, gameData);
      gameCount = 1; // Reset gameCount for the next batch
    } else {
      gameCount++;
    }
  }

  if (gameCount > 1) {
    await processBatch(gameDataRequest, gameData);
  }

  // Further processing or file writing can be done here based on gameResults
  const writableGameData = JSON.stringify(gameData);
  const writableEntityData = JSON.stringify(entityData);
  const writableRoleData = JSON.stringify(roleData);
  const writableRelationshipData = JSON.stringify(relationshipData);
  const filesToWrite: Array<Promise<void>> = [];
  filesToWrite.push(
    writeToFile(dataConfigs.localData.gameDataFile, writableGameData),
    writeToFile(dataConfigs.localData.entityDataFile, writableEntityData),
    writeToFile(dataConfigs.localData.roleDataFile, writableRoleData),
    writeToFile(
      dataConfigs.localData.relationshipDataFile,
      writableRelationshipData,
    ),
  );
  await Promise.all(filesToWrite).catch((error) => {
    logMessage("ERROR", "Failed to write some files", error.message);
  });

  const entityGameData: EntityGameDataSave = {
    gameData,
    entityData,
    roleData,
    relationshipData,
  };

  logMessage("HAPPY", "Finished processing and saving game data!");
  return {
    data: JSON.stringify(entityGameData),
    successOrFailure: "SUCCESS",
    message: "Formatted collection data successfully",
  };
}
