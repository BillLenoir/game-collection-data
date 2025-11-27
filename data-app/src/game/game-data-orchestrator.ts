import { formatGameData } from "./format-game-data.service";
import { gameRelationshipProcessor } from "./game-relationships-process.service";
import { convertBggData } from "../collection/convert-bgg-data.service";
import { callBggApi } from "../utils/bgg-api-client";
import { dataConfigs } from "../utils/data.config";
import type {
  BggGameDataFromCollection,
  BggGameDataFromSingleCall,
  BggGameDataFromSingleCallJustTheGame,
  ConvertBggDataInput,
  DataResponse,
  FetchDataFromBggInput,
  FormatGameDataInput,
  GameData,
  SaveBggDataInput,
} from "../utils/data.types";
import { runStepFunction } from "../utils/run-step-function";
import { saveBggData } from "../utils/save-bgg-data.service";

export const gameDataOrchestrator = async (
  gameId: string,
  bggGameDataFromCollection: BggGameDataFromCollection,
): Promise<DataResponse<GameData> | void> => {
  // FETCH BGG GAME DATA
  const bggGameId = bggGameDataFromCollection._attributes.objectid;
  const fetchGameDataFromBggInput: FetchDataFromBggInput = {
    path: "boardgame",
    parameters: bggGameId,
  };
  const fetchGameDataFromBggResponse = await runStepFunction(
    `Fetch BGG Game Data for ${bggGameId}`,
    callBggApi,
    fetchGameDataFromBggInput,
  );
  if (!fetchGameDataFromBggResponse)
    return {
      ok: false,
      message: "Fetch failed",
    };

  // SAVE BGG GAME DATA
  const saveBggDataInput: SaveBggDataInput = {
    dataToSave: fetchGameDataFromBggResponse,
    directory: `${dataConfigs.localData.dataDirectory}game-data/`,
    fileName: `game-${bggGameId}.xml`,
  };
  const saveBggDataResponse = await runStepFunction(
    `Save BGG Game Data for ${bggGameId}`,
    saveBggData,
    saveBggDataInput,
  );
  if (!saveBggDataResponse) {
    return {
      ok: false,
      message: "Save failed",
    };
  }

  // CONVERT BGG GAME DATA
  const convertBggDataInput: ConvertBggDataInput = {
    xml: fetchGameDataFromBggResponse,
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
  if (!convertBggDataResponse) {
    return {
      ok: false,
      message: "Conversion failed",
    };
  }

  // FORMAT CONVERTED GAME DATA
  const formatBggGameDataInput: FormatGameDataInput = {
    gameId,
    collectionData: bggGameDataFromCollection,
    gameData: convertBggDataResponse,
  };
  await runStepFunction<FormatGameDataInput, GameData>(
    "Format Collection Data",
    formatGameData,
    formatBggGameDataInput,
  );

  // PROCESS GAME RELATIONSHIPS
  const processGameRelationshipsInput: BggGameDataFromSingleCallJustTheGame =
    convertBggDataResponse.boardgames.boardgame;
  const processGameRelationshipsResponse = await runStepFunction<
    BggGameDataFromSingleCallJustTheGame,
    string
  >(
    "Process game relationships",
    gameRelationshipProcessor.processGameRelationships,
    processGameRelationshipsInput,
  );
  if (!processGameRelationshipsResponse) {
    return {
      ok: false,
      message: "Extraction of Entities failed",
    };
  }
};
