import fs from 'fs/promises';
import convert from 'xml-js';
import { fetchData } from './fetch-data.js';
import { BggGameData, GameOnlyData } from './interfaces.js';

export async function prepareGameOnlyData(
  collectionData: BggGameData,
): Promise<GameOnlyData[]> {
  console.log('\x1b[32m%s\x1b[0m', 'Begin processing each game...');
  // An array where each element is parsed data for a single game.
  const parsedCollectionData: GameOnlyData[] = [];

  // This cycles through the collection data, one game at a time.
  for (const game of collectionData.items.item) {
    // Will only process games that I own, want, previously owned, or want to sell or trade
    if (
      game.status._attributes.own === '1' ||
      game.status._attributes.want === '1' ||
      game.status._attributes.prevowned === '1' ||
      game.status._attributes.fortrade === '1'
    ) {
      // Extract the data from the transformation colleciton data request..
      const gameID = game._attributes.objectid ?? '';

      const gameTitle = game.name._text ?? '';

      const gameYearPublished =
        game.yearpublished !== undefined
          ? game.yearpublished._text
          : 'No year indicated';

      // This gets checked again later because the data could live
      // in two places, hence the "let" statement.
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
      let rawResponseGameData = await fetchData('boardgame', gameID);

      const rawResponseGameDataFile: string = `./src/data/game-data/game-${gameID}.xml`;
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

        const parsedGameData = JSON.parse(convertedResponseGameData);
        const gameData = parsedGameData.boardgames.boardgame;

        // These are the elements that we extract from the additional call.
        const gameDescription = gameData.description._text ?? '';

        // Some games have more than 1 publisher and the data structure for this differs
        // If it is an array, that means there's more than one.
        let gamePublisher: string[] = [];
        if (gameData.boardgamepublisher !== undefined) {
          if (Array.isArray(gameData.boardgamepublisher)) {
            for (const publisher of gameData.boardgamepublisher) {
              gamePublisher.push(publisher._text);
            }
          } else {
            gamePublisher.push(gameData.boardgamepublisher._text);
          }
        }

        // Ditto for game designers, though there may not be any designer listed.
        let gameDesigner: string[] = [];
        if (gameData.boardgamedesigner !== undefined) {
          if (Array.isArray(gameData.boardgamedesigner)) {
            for (const designer of gameData.boardgamedesigner) {
              gameDesigner.push(designer._text);
            }
          } else {
            gameDesigner.push(gameData.boardgamedesigner._text);
          }
        }

        // This is the JSON extracted for each game.
        const gameJSON: GameOnlyData = {
          id: gameID,
          title: gameTitle,
          yearpublished: gameYearPublished,
          thumbnail: gameThumbnail,
          publisher: gamePublisher,
          designer: gameDesigner,
          description: gameDescription,
          gameown: gameOwn,
          gamewanttobuy: gameWantToBuy,
          gameprevowned: gamePrevOwned,
          gamefortrade: gameForTrade,
        };

        parsedCollectionData.push(gameJSON);
      } else {
        if (retryFetch === true) {
          console.log(`Retrying the fetch of ${gameID}'s data`);
          rawResponseGameData = await fetchData('boardgame', gameID);
          retryFetch = false;
        } else {
          retryFetch = true;
          console.error(
            '\x1b[31m%s\x1b[0m',
            `!!!! Tried twice to fetch ${gameID}'s data, but it failed each time, so data is not saved for this game`,
          );
        }
      }
    } else {
      console.log(`-- This game doesn't count: ${game.name._text}`);
    }
  }
  console.log('\x1b[32m%s\x1b[0m', '... done processing the games');

  return parsedCollectionData;
}
