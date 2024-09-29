import fs from 'fs/promises';
import convert from 'xml-js';
import { fetchData } from './fetch-data';
import {
  BggGameData,
  EntityGameDataSave,
  ComboEntityData,
  ComboGameData,
  ComboRelationshipData,
  EntityData,
} from './interfaces';

export async function prepareEntityGameData(
  collectionData: BggGameData,
): Promise<EntityGameDataSave> {
  console.log('\x1b[32m%s\x1b[0m', 'Begin processing each game...');
  // An array where each element is parsed data for a single game.
  let parsedEntityData: ComboEntityData[] = [];
  const parsedGameData: ComboGameData[] = [];
  const parsedRelationshipData: ComboRelationshipData[] = [];

  // This cycles through the collection data, one game at a time.
  let idCount = 1;
  for (const game of collectionData.items.item) {
    // Will only process games that I own, want, previously owned, or want to sell or trade
    if (
      game.status._attributes.own === '1' ||
      game.status._attributes.want === '1' ||
      game.status._attributes.prevowned === '1' ||
      game.status._attributes.fortrade === '1'
    ) {
      const thisGameId = idCount++;

      // Extract the data from the transformation colleciton data request..
      // BGG Game ID
      const bggGameID = game._attributes.objectid ?? '';

      // Game Title
      const gameTitle = game.name._text ?? 'No title';

      const gameYearPublished =
        game.yearpublished !== undefined
          ? game.yearpublished._text
          : 'No year indicated';

      // We check again later to see if there might be data for this
      // Hence the "let" statement
      let gameThumbnail =
        game.thumbnail !== undefined ? game.thumbnail._text : 'No thumbnail';

      const gameOwn = game.status._attributes.own === '1' ? true : false;

      const gameWantToBuy = game.status._attributes.want === '1' ? true : false;

      const gamePrevOwned =
        game.status._attributes.prevowned === '1' ? true : false;

      const gameForTrade =
        game.status._attributes.fortrade === '1' ? true : false;

      // Fetch additional game data.
      let retryFetch = true;
      let rawResponseGameData = await fetchData('boardgame', bggGameID);

      const rawResponseGameDataFile = `./src/data/game-data/game-${bggGameID}.xml`;
      if (rawResponseGameData !== undefined) {
        await fs.writeFile(rawResponseGameDataFile, rawResponseGameData);
        // Transform the game data response
        const convertedResponseGameData = convert.xml2json(
          rawResponseGameData,
          {
            compact: true,
            spaces: 2,
          },
        );

        const fullGameData = JSON.parse(convertedResponseGameData);
        const gameData = fullGameData.boardgames.boardgame;

        // These are the elements that we extract from the additional call.
        const gameDescription = gameData.description._text ?? '';

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
            entity.relationshiptype = 'Designer';
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
            entity.relationshiptype = 'Publisher';
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
            entity.relationshiptype = 'Game Family';
            entityArray.push(entity);
          }
        }

        if (entityArray.length > 0) {
          processEntitiesAndRelationships(entityArray, thisGameId);
        }
      } else {
        if (retryFetch === true) {
          console.log(`Retrying the fetch of ${bggGameID}'s data`);
          rawResponseGameData = await fetchData('boardgame', bggGameID);
          retryFetch = false;
        } else {
          retryFetch = true;
          console.error(
            '\x1b[31m%s\x1b[0m',
            `!!!! Tried twice to fetch ${bggGameID}'s data, but it failed each time, so data is not saved for this game`,
          );
        }
      }
    } else {
      console.log(`-- This game doesn't count: ${game.name._text}`);
    }
  }
  console.log('\x1b[32m%s\x1b[0m', '... done processing the games');

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

  return parsedEntityGameData;
}
