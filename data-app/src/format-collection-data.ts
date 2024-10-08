import fs from "fs/promises";
import convert from "xml-js";
import { getGameData } from "./get-game-data";
import { dataConfigs } from "./utils/data.config";
import {
  type BggCollectionData,
  type BggGameDataFromCollection,
  type BggGameDataFromSingleCall,
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

// Process individual game data
async function processGame(
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

  processEntitiesRolesAndRelationships(fullGameData.boardgames.boardgame, id);

  return {
    data: JSON.stringify({
      id,
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

function processEntitiesRolesAndRelationships(
  gameData: BggGameDataFromSingleCall,
  gameId: string,
): void {
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
      // Processing Role
      const foundRole = roleData.find(
        (existingRole) => existingRole.name === roleName,
      );
      const thisRole = {
        id: foundRole?.id ? foundRole.id : `${idCount++}`,
        name: roleName,
      };
      if (!foundRole) {
        // This is a new role
        roleData.push(thisRole);
      }
      // Processing Entities
      const possibleBggEntities = Array.isArray(value) ? value : [value];
      for (const entity of possibleBggEntities) {
        const foundEntity = entityData.find(
          (existingEntity) =>
            existingEntity.bggid === entity._attributes.objectid &&
            existingEntity.name == entity._text,
        );
        const thisEntity = {
          id: foundEntity?.id ? foundEntity.id : `${entity._text}-${idCount++}`,
          bggid: entity._attributes.objectid,
          name: entity._text || "",
        };
        if (!foundEntity) {
          // This is a new entity
          entityData.push(thisEntity);
        }
        // Processing relationships
        relationshipData.push({
          gameId: gameId,
          entityId: thisEntity.id,
          roleId: thisRole.id,
        });
      }
    }
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
    gameDataRequest.push(processGame(game));
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
  const gameData: GameData[] = gameDataResponse
    .filter(
      (result): result is PromiseFulfilledResult<DataResponse> =>
        result.status === "fulfilled",
    )
    .map((result) => JSON.parse(result.value.data));
  gameDataResponse
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    )
    .forEach((result, index) =>
      logMessage(
        "ERROR",
        `Game processing failed for game ${collectionData.items.item[index]!.name._text}. Reason:`,
        result.reason,
      ),
    );

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
