import { fetchCollectionDataFromBgg } from "./fetch-bgg-collection-data.service";
import { convertBggData } from "../utils/convert-bgg-data";
import { dataConfigs } from "../utils/data.config";
import type {
  BggCollectionData,
  ConvertBggDataInput,
  bggApiClientInput,
  SaveBggDataInput,
} from "../utils/data.types";
import { runStepFunction } from "../utils/run-step-function";
import { saveBggData } from "../utils/save-bgg-data";

export const collectionDataOrchestrator = async (): Promise<void> => {
  // FETCH BGG COLLECTION DATA
  const fetchCollectionDataFromBggInput: bggApiClientInput = {
    path: "collection",
    parameters: dataConfigs.bggUserId,
  };
  const fetchCollectionDataFromBggResponse = await runStepFunction(
    "Fetch BGG Collection Data",
    fetchCollectionDataFromBgg,
    fetchCollectionDataFromBggInput,
  );
  if (!fetchCollectionDataFromBggResponse) return;

  // SAVE BGG COLLECTION DATA
  const saveBggDataInput: SaveBggDataInput = {
    dataToSave: fetchCollectionDataFromBggResponse,
    directory: dataConfigs.localData.dataDirectory,
    fileName: dataConfigs.localData.rawResponseFile,
  };
  const saveBggDataResponse = await runStepFunction(
    "Save BGG Collection Data",
    saveBggData,
    saveBggDataInput,
  );
  if (!saveBggDataResponse) return;

  // CONVERT BGG COLLECTION DATA
  const convertBggDataInput: ConvertBggDataInput = {
    xml: fetchCollectionDataFromBggResponse,
    options: { compact: true, spaces: 2 },
  };
  const convertBggDataResponse = await runStepFunction<
    ConvertBggDataInput,
    BggCollectionData
  >("Convert BGG Collection Data", convertBggData, convertBggDataInput);
  if (!convertBggDataResponse) return;

  // FORMAT CONVERTED COLLECTION DATA
  const formatCollectionDataResponse = await runStepFunction(
    "Format Collection Data",
    formatCollectionData,
    convertBggDataResponse,
  );
  if (!formatCollectionDataResponse) return;

  // SAVE FORMATTED COLLECTION DATA
  const saveFormattedDataResponseInput: SaveBggDataInput = {
    dataToSave: formatCollectionDataResponse,
    directory: dataConfigs.localData.dataDirectory,
    fileName: dataConfigs.localData.gameDataFile,
  };
  const saveFormattedDataResponse = await runStepFunction(
    "Save BGG Collection Data",
    saveBggData,
    saveFormattedDataResponseInput,
  );
  if (!saveFormattedDataResponse) return;

  // HYDRATE DATABASE
  await runStepFunction(
    "Hydrate Collection Data",
    hydrateDatabase,
    formatCollectionDataResponse,
  );
};
