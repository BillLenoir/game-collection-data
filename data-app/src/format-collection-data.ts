import fs from "fs/promises";
import convert from "xml-js";
import { getGameData } from "./get-game-data";
import { dataConfigs } from "./utils/data.config";
import {
  type BggCollectionData,
  type EntityGameDataSave,
  type EntityData,
  type GameData,
  type RelationshipData,
  type BggEntityData,
  type DataResponse,
} from "./utils/data.types";
import { logMessage } from "./utils/log-messages";

export async function formatCollectionData(
  rawCollectionData: string,
): Promise<DataResponse> {
  // Transform the response from XML to JSON
  const convertedResponse = convert.xml2json(rawCollectionData, {
    compact: true,
    spaces: 2,
  });

  const collectionData: BggCollectionData = JSON.parse(convertedResponse);
  logMessage("INFO", "XML response from BGG converted to JSON!");
  logMessage("INFO", "Begin processing the games...");

  // An array where each element is parsed data for a single entity, game, or relationship.
  const parsedEntityData: EntityData[] = [];
  const parsedGameData: GameData[] = [];
  const parsedRelationshipData: RelationshipData[] = [];

  let idCount = 1;

  // This cycles through the collection data, one game at a time.
  for (const game of collectionData.items.item) {
    // Will only process games that I own, want, previously owned, or want to sell or trade
    if (
      game.status._attributes.own === "1" ||
      game.status._attributes.want === "1" ||
      game.status._attributes.prevowned === "1" ||
      game.status._attributes.fortrade === "1"
    ) {
      const thisGameId = idCount;
      const bggGameId = game._attributes.objectid ?? "";
      const gameTitle = game.name._text ?? "No title";
      const gameYearPublished =
        game.yearpublished !== undefined
          ? game.yearpublished._text
          : "No year indicated";

      // We check again later to see if there might be data for this
      // Hence the "let" statement
      let gameThumbnail =
        game.thumbnail !== undefined ? game.thumbnail._text : "No thumbnail";

      const gameOwn = game.status._attributes.own === "1" ? true : false;
      const gameWantToBuy = game.status._attributes.want === "1" ? true : false;
      const gamePrevOwned =
        game.status._attributes.prevowned === "1" ? true : false;
      const gameForTrade =
        game.status._attributes.fortrade === "1" ? true : false;

      const moreGameData = await getGameData(bggGameId);

      if (!moreGameData || moreGameData.successOrFailure === "FAIL") {
        logMessage(
          "ERROR",
          `Problem getting data for ${game.name}`,
          moreGameData.message,
        );
      }
      const rawResponseGameDataFile = `./src/data/game-data/game-${bggGameId}.xml`;
      const gameDataDirectory = `${dataConfigs.localData.dataDirectory}game-data/`;

      // Create directory if it doesn't exist
      if (!(await fs.stat(gameDataDirectory).catch(() => false))) {
        await fs.mkdir(gameDataDirectory, { recursive: true });
      }

      try {
        await fs.writeFile(rawResponseGameDataFile, moreGameData.data);
      } catch (error) {
        logMessage(
          "ERROR",
          `Something happened when writing the file for ${gameTitle}`,
          `${error instanceof Error ? error.message : String(error)}`,
        );
      }

      // Transform the game data response
      const convertedResponseGameData = convert.xml2json(moreGameData.data, {
        compact: true,
        spaces: 2,
      });

      const fullGameData = JSON.parse(convertedResponseGameData);
      const gameData = fullGameData.boardgames.boardgame;

      // These are the elements that we extract from the additional call.
      const gameDescription = gameData.description._text ?? "";

      // This is the JSON extracted for each game.
      const gameJSON: GameData = {
        id: thisGameId,
        bggid: bggGameId,
        title: gameTitle,
        yearpublished: gameYearPublished,
        thumbnail: gameThumbnail,
        description: gameDescription,
        gameown: gameOwn,
        gamewanttobuy: gameWantToBuy,
        gameprevowned: gamePrevOwned,
        gamefortrade: gameForTrade,
      };

      parsedGameData.push(gameJSON);

      // Start processing entities and relationships
      const entityArray: BggEntityData[] = [];

      // Processing entities.
      // Designers
      if (gameData.boardgamedesigner !== undefined) {
        const gameDesigner = Array.isArray(gameData.boardgamedesigner)
          ? gameData.boardgamedesigner
          : [gameData.boardgamedesigner];
        for (const entity of gameDesigner) {
          entity.relationshiptype = "Designer";
          entity._attributes.objectid = `person-${entity._attributes.objectid}`;
          entityArray.push(entity);
        }
      }

      // Publishers
      if (gameData.boardgamepublisher !== undefined) {
        const gamePublisher = Array.isArray(gameData.boardgamepublisher)
          ? gameData.boardgamepublisher
          : [gameData.boardgamepublisher];
        for (const entity of gamePublisher) {
          entity.relationshiptype = "Publisher";
          entity._attributes.objectid = `org-${entity._attributes.objectid}`;
          entityArray.push(entity);
        }
      }

      // Game Family
      if (gameData.boardgamefamily !== undefined) {
        const gameFamily = Array.isArray(gameData.boardgamefamily)
          ? gameData.boardgamefamily
          : [gameData.boardgamefamily];
        for (const entity of gameFamily) {
          entity.relationshiptype = "Game Family";
          entityArray.push(entity);
        }
      }

      if (entityArray.length > 0) {
        processEntitiesAndRelationships(entityArray, thisGameId);
      }
    } else {
      logMessage("WARNING", `-- This game doesn't count: ${game.name._text}`);
    }
  }
  logMessage("INFO", "... done processing the games");

  const parsedEntityGameData: EntityGameDataSave = {
    entitydata: parsedEntityData,
    gamedata: parsedGameData,
    relationshipdata: parsedRelationshipData,
  };
  logMessage("INFO", `Entities processed: ${parsedEntityData.length}`);
  logMessage("INFO", `Games processed: ${parsedGameData.length}`);
  logMessage(
    "INFO",
    `Relationships processed: ${parsedRelationshipData.length}`,
  );

  function processEntitiesAndRelationships(
    entityArray: BggEntityData[],
    thisGameId: number,
  ) {
    for (const entity of entityArray) {
      const entityExists = parsedEntityData.find(
        (element) => element.bggid === entity._attributes.objectid,
      );
      let thisEntityId: number | null = null;
      if (entityExists === undefined) {
        const newEntity: EntityData = {
          id: idCount++,
          bggid: entity._attributes.objectid,
          name: entity._text,
        };
        thisEntityId = newEntity.id;
        parsedEntityData.push(newEntity);
      } else if (entityExists.name !== entity._text) {
        throw new Error(
          `We have two entities with the same BGG ID (${entityExists.bggid} and ${entity._attributes.objectid})! ${entityExists.name} and ${entity._text}`,
        );
      } else {
        thisEntityId = entityExists.id;
      }
      if (thisEntityId === undefined) {
        throw new Error(`There is no ID for ${entityExists?.name}`);
      }
      const newRelationship = {
        gameid: thisGameId,
        entityid: thisEntityId,
        relationshiptype: entity.relationshiptype,
      };
      parsedRelationshipData.push(newRelationship);
    }
  }

  // Changed the flow to save 3 separate files insted of one
  const gameComboDataFile = "./src/data/game-combo-data.json";
  const writableGameComboData = JSON.stringify(parsedEntityGameData.gamedata);
  const entityDataFile = "./src/data/entity-data.json";
  const writableEntityData = JSON.stringify(parsedEntityGameData.entitydata);
  const relationshipDataFile = "./src/data/relationship-data.json";
  const writableRelationshipData = JSON.stringify(
    parsedEntityGameData.relationshipdata,
  );
  // const writableEntityGameData = JSON.stringify(parsedEntityGameData);
  await fs.writeFile(gameComboDataFile, writableGameComboData);
  await fs.writeFile(entityDataFile, writableEntityData);
  await fs.writeFile(relationshipDataFile, writableRelationshipData);

  logMessage(
    "INFO",
    "Wrote the parsed entity-game data files for the collection data!",
  );
  return {
    data: JSON.stringify(parsedEntityGameData),
    successOrFailure: "SUCCESS",
    message: "Have formatted the collection data!",
  };
}
