import { convertBggData } from "./convert-bgg-data.service";
import { fetchCollectionDataFromBgg } from "./fetch-bgg-collection-data.service";
import { hydrateDatabase } from "./hydrate-database";
import { saveBggData } from "./save-bgg-data.service";
import { dataConfigs } from "./utils/data.config";
import type {
  BggCollectionData,
  ConvertBggDataInput,
  FetchDataFromBggInput,
  SaveBggDataInput,
} from "./utils/data.types";
import { runStepFunction } from "./utils/run-step-function";

export const collectionDataOrchestrator = async (): Promise<void> => {
  // FETCH BGG COLLECTION DATA
  const fetchCollectionDataFromBggInput: FetchDataFromBggInput = {
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
  const convertBggDataResponse: BggCollectionData | void =
    await runStepFunction<ConvertBggDataInput, BggCollectionData>(
      "Convert BGG Collection Data",
      convertBggData,
      convertBggDataInput,
    );
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
