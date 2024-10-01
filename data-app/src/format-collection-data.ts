import fs from "fs";
import convert from "xml-js";
import {
  type BggGameData,
  type EntityGameDataSave,
  type ComboEntityData,
  type ComboGameData,
  type ComboRelationshipData,
  type EntityData,
  type DataResponse,
  type SuccessOrFailure,
} from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";

export async function formatCollectionData(
  rawCollectionData: string,
): Promise<DataResponse> {
  let successOrFailure: SuccessOrFailure = "SUCCESS";
  let message = "";

  // Transform the response from XML to JSON
  const convertedResponse = convert.xml2json(rawCollectionData, {
    compact: true,
    spaces: 2,
  });

  const collectionData: BggGameData = JSON.parse(convertedResponse);
  console.log("\x1b[32m%s\x1b[0m", "I transformed the collection data!");

  console.log("\x1b[32m%s\x1b[0m", "Begin processing each game...");

  // An array where each element is parsed data for a single game.
  const parsedEntityData: ComboEntityData[] = [];
  const parsedGameData: ComboGameData[] = [];
  const parsedRelationshipData: ComboRelationshipData[] = [];

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
      const thisGameId = idCount++;

      // Extract the data from the transformation collection data request.
      const bggGameID = game._attributes.objectid ?? "";
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

      // Fetch additional game data.
      let retryFetch = true;
      let gameResponse;

      try {
        gameResponse = await fetchData("boardgame", bggGameID);

        if (gameResponse === undefined) {
          throw new Error("There was no response from BGG");
        }

        if (
          gameResponse.data.includes(
            "Your request for this collection has been accepted and will be processed",
          ) === true
        ) {
          throw new Error(
            "Your request for this collection has been accepted and will be processed.  Please try again later for access.",
          );
        }
      } catch (error) {
        console.error(error);
      }

      // Cannot arrive at this point if the directory doesn't exist, so no need to check.
      const rawResponseGameDataFile = `./src/data/game-data/game-${bggGameID}.xml`;
      if (gameResponse !== undefined) {
        fs.writeFile(rawResponseGameDataFile, gameResponse.data, (error) => {
          if (error) {
            successOrFailure = "FAIL";
            message = `${error}`;
          }
        });

        // Transform the game data response
        const convertedResponseGameData = convert.xml2json(gameResponse.data, {
          compact: true,
          spaces: 2,
        });

        const fullGameData = JSON.parse(convertedResponseGameData);
        const gameData = fullGameData.boardgames.boardgame;

        // These are the elements that we extract from the additional call.
        const gameDescription = gameData.description._text ?? "";

        // This is the JSON extracted for each game.
        const gameJSON: ComboGameData = {
          id: thisGameId,
          bggid: bggGameID,
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
        const entityArray: EntityData[] = [];

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
        if (retryFetch === true) {
          console.log(`Retrying the fetch of ${bggGameID}'s data`);
          gameResponse = await fetchData("boardgame", bggGameID);
          retryFetch = false;
        } else {
          retryFetch = true;
          console.error(
            "\x1b[31m%s\x1b[0m",
            `!!!! Tried twice to fetch ${bggGameID}'s data, but it failed each time, so data is not saved for this game`,
          );
        }
      }
    } else {
      console.log(`-- This game doesn't count: ${game.name._text}`);
    }
  }
  console.log("\x1b[32m%s\x1b[0m", "... done processing the games");

  const parsedEntityGameData: EntityGameDataSave = {
    entitydata: parsedEntityData,
    gamedata: parsedGameData,
    relationshipdata: parsedRelationshipData,
  };
  console.log(`Entities processed: ${parsedEntityData.length}`);
  console.log(`Games processed: ${parsedGameData.length}`);
  console.log(`Relationships processed: ${parsedRelationshipData.length}`);

  function processEntitiesAndRelationships(
    entityArray: EntityData[],
    thisGameId: number,
  ) {
    for (const entity of entityArray) {
      const entityExists = parsedEntityData.find(
        (element) => element.bggid === entity._attributes.objectid,
      );
      let thisEntityId: number | null = null;
      if (entityExists === undefined) {
        const newEntity: ComboEntityData = {
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
  fs.writeFile(gameComboDataFile, writableGameComboData, (error) => {
    if (error) {
      successOrFailure = "FAIL";
      message = `${error}`;
    }
  });
  fs.writeFile(entityDataFile, writableEntityData, (error) => {
    if (error) {
      successOrFailure = "FAIL";
      message = `${error}`;
    }
  });
  fs.writeFile(relationshipDataFile, writableRelationshipData, (error) => {
    if (error) {
      successOrFailure = "FAIL";
      message = `${error}`;
    }
  });

  console.log(
    "\x1b[32m%s\x1b[0m",
    "I wrote the parsed entity-game data files for the collection data!",
  );
  return {
    data: JSON.stringify(parsedEntityGameData),
    successOrFailure,
    message,
  };
}
