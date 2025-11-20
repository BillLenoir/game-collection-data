import fs from "fs/promises";
import convert from "xml-js";
import { getGameData } from "./get-game-data";
import { dataConfigs } from "../utils/data.config";
import type {
  BggGameDataFromSingleCallJustTheGame,
  ExtractedEntities,
  BggGameDataFromCollection,
  DataResponse,
  EntityData,
  EntityGameDataSave,
  GameData,
  RelationshipData,
  RoleData,
  BggCollectionData,
} from "../utils/data.types";
import { logMessage } from "../utils/log-messages";

async function processBatch(
  requests: Array<Promise<DataResponse>>,
  gameData: GameData[],
): Promise<DataResponse | void> {
  const gameDataResponse = await Promise.allSettled(requests);

  for (let j = 0; j < gameDataResponse.length; j++) {
    if (gameDataResponse[j]?.status === "fulfilled") {
      const thisGameDataResponse = gameDataResponse[
        j
      ] as PromiseFulfilledResult<DataResponse>;
      if (thisGameDataResponse.status) {
        gameData.push(JSON.parse(thisGameDataResponse.value.));
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
    if (!moreGameData || moreGameData.ok === "FAIL") {
      return {
        data: "",
        ok: "FAIL",
        message: thisMessage,
      };
    }
  } catch (error) {
    return {
      data: "",
      ok: "FAIL",
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
    ok: "SUCCESS",
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

export async function formatCollectionDataOrchestrator(
  collectionData: string,
): Promise<DataResponse> {
  const entityData: EntityData[] = [];
  const roleData: RoleData[] = [];
  const relationshipData: RelationshipData[] = [];
  const gameDataRequest: Array<Promise<DataResponse>> = [];
  let gameData: GameData[] = [];
  const batchedGames = 60;
  let gameCount = 1;

  const parsedCollectionData: BggCollectionData = JSON.parse(collectionData);
  logMessage(
    "INFO",
    `Number of Games: ${parsedCollectionData.items.item.length}`,
  );

  for (const game of parsedCollectionData.items.item) {
    if (gameCount === 1) {
      gameDataRequest.length = 0; // Reset the batch
    }

    gameDataRequest.push(processGame(game));

    if (gameCount === batchedGames) {
      await processBatch(gameDataRequest, gameData);
      gameCount = 1;
    } else {
      gameCount++;
    }
  }

  if (gameCount > 1) {
    await processBatch(gameDataRequest, gameData);
  }

  const entityGameData: EntityGameDataSave = {
    gameData,
    entityData,
    roleData,
    relationshipData,
  };

  return {
    ok: true,
    data: JSON.stringify(entityGameData),
    message: "Formatted collection data successfully",
  };
}
