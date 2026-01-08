import { fetchBggDataForGame } from "./fetch-bgg-data-for-game.service";
import { formatGameData } from "./format-game-data.service";
import { gameRelationshipProcessor } from "./game-relationships-process.service";
import { convertBggData } from "../utils/convert-bgg-data";
import { dataConfigs } from "../utils/data.config";
import type {
  BggGameDataFromCollection,
  BggGameDataFromSingleCall,
  BggGameDataFromSingleCallJustTheGame,
  ConvertBggDataInput,
  DataResponse,
  bggApiClientInput,
  FormatGameDataInput,
  GameData,
  SaveBggDataInput,
} from "../utils/data.types";
import { runStepFunction } from "../utils/run-step-function";
import { saveBggData } from "../utils/save-bgg-data";

export const gameDataOrchestrator = async (
  gameId: string,
  bggGameDataFromCollection: BggGameDataFromCollection,
): Promise<DataResponse> => {
  // Step 1: FETCH BGG GAME DATA
  const bggGameId = bggGameDataFromCollection._attributes.objectid;
  const fetchBggDataForGameInput: bggApiClientInput = {
    parameters: bggGameId,
  };
  const fetchGameDataFromBggResponse = await runStepFunction<
    bggApiClientInput,
    string
  >(
    `Fetch BGG Game Data for ${bggGameId}`,
    fetchBggDataForGame,
    fetchBggDataForGameInput,
  );
  if (!fetchGameDataFromBggResponse.ok)
    return {
      ok: false,
      message: `Fetch failed for ${bggGameId}: ${fetchGameDataFromBggResponse.message}`,
    };

  // Step 2: SAVE BGG GAME DATA
  const saveBggDataInput: SaveBggDataInput = {
    dataToSave: fetchGameDataFromBggResponse.data,
    directory: `${dataConfigs.localData.dataDirectory}game-data/`,
    fileName: `game-${bggGameId}.xml`,
  };
  const saveBggDataResponse = await runStepFunction<SaveBggDataInput, string>(
    `Save BGG Game Data for ${bggGameId}`,
    saveBggData,
    saveBggDataInput,
  );
  if (!saveBggDataResponse.ok) {
    return {
      ok: false,
      message: `Save failed for ${bggGameId}: ${fetchGameDataFromBggResponse.message}`,
    };
  }

  // Step 3: CONVERT BGG GAME DATA
  const convertBggDataInput: ConvertBggDataInput = {
    xml: fetchGameDataFromBggResponse.data,
    options: { compact: true, spaces: 2 },
  };
  const convertBggDataResponse = await runStepFunction<
    ConvertBggDataInput,
    BggGameDataFromSingleCall
  >(
    `Convert BGG Game Data for ${bggGameId}`,
    convertBggData,
    convertBggDataInput,
  );
  if (!convertBggDataResponse.ok) {
    return {
      ok: false,
      message: `Conversion failed for ${bggGameId}: ${fetchGameDataFromBggResponse.message}`,
    };
  }

  // Step 4: FORMAT CONVERTED GAME DATA
  const formatBggGameDataInput: FormatGameDataInput = {
    gameId,
    collectionData: bggGameDataFromCollection,
    gameData: convertBggDataResponse.data,
  };
  const formatBggGameDataResponse = await runStepFunction<
    FormatGameDataInput,
    GameData
  >("Format Collection Data", formatGameData, formatBggGameDataInput);
  if (!formatBggGameDataResponse.ok) {
    return {
      ok: false,
      message: `Conversion failed for ${bggGameId}: ${fetchGameDataFromBggResponse.message}`,
    };
  }

  // Step 5: PROCESS GAME RELATIONSHIPS
  const processGameRelationshipsInput: BggGameDataFromSingleCallJustTheGame =
    convertBggDataResponse.data.boardgames.boardgame;
  const processGameRelationshipsResponse = await runStepFunction<
    BggGameDataFromSingleCallJustTheGame,
    string
  >(
    "Process game relationships",
    gameRelationshipProcessor.processGameRelationships,
    processGameRelationshipsInput,
  );
  if (!processGameRelationshipsResponse.ok) {
    return {
      ok: false,
      message: `Processing of game relationships failed for ${bggGameId}: ${fetchGameDataFromBggResponse.message}`,
    };
  }

  return {
    ok: true,
    data: "No data to return",
    message: `Successfully processed game id: ${bggGameId}`,
  };
};
