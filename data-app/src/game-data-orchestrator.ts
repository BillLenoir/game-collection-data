import { convertBggData } from "./convert-bgg-data.service";
import { extractEntities } from "./extract-entities.service";
import { formatGameData } from "./format-game-data.service";
import { saveBggData } from "./save-bgg-data.service";
import { callBggApi } from "./utils/bgg-api-client";
import { dataConfigs } from "./utils/data.config";
import type {
  BggGameDataFromCollection,
  BggGameDataFromSingleCall,
  BggGameDataFromSingleCallJustTheGame,
  ConvertBggDataInput,
  DataResponse,
  ExtractedEntities,
  FetchDataFromBggInput,
  FormatGameDataInput,
  GameData,
  SaveBggDataInput,
} from "./utils/data.types";
import { runStepFunction } from "./utils/run-step-function";

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
  if (!fetchGameDataFromBggResponse) {
    return {
      ok: false,
      message: "Fetch failed",
    };
  }

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
  const formatDataResponse = await runStepFunction<
    FormatGameDataInput,
    GameData
  >("Format Collection Data", formatGameData, formatBggGameDataInput);
  if (!formatDataResponse) return;

  // EXTRACT ENTITIES
  const extractAndProcessEntitiesInput: BggGameDataFromSingleCallJustTheGame =
    convertBggDataResponse.boardgames.boardgame;
  const extractAndProcessEntitiesResponse = await runStepFunction<
    BggGameDataFromSingleCallJustTheGame,
    ExtractedEntities
  >(
    "Extract and Process Entities",
    extractEntities,
    extractAndProcessEntitiesInput,
  );
  if (!extractAndProcessEntitiesResponse) return;
};
