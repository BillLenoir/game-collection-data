import { convertBggData } from "./convert-bgg-data.service";
import { fetchDataFromBgg } from "./fetch-bgg-data.service";
import { formatCollectionDataOrchestrator } from "./format-collection-data";
import { hydrateDatabase } from "./hydrate-database";
import { saveBggData } from "./save-bgg-data.service";
import { dataConfigs } from "./utils/data.config";
import { runStepFunction } from "./utils/run-step-function";

export async function collectionDataOrchestrator(): Promise<void> {
  // FETCH BGG COLLECTION DATA
  const fetchBggDataParameters = {
    path: "collection",
    parameters: dataConfigs.bggUserId,
  };
  const fetchBggDataResponse = await runStepFunction(
    "Fetch BGG Collection Data",
    fetchDataFromBgg,
    fetchBggDataParameters,
  );
  if (!fetchBggDataResponse) return;

  // SAVE BGG COLLECTION DATA
  const saveBggDataResponse = await runStepFunction(
    "Save BGG Collection Data",
    saveBggData,
    fetchBggDataResponse,
  );
  if (!saveBggDataResponse) return;

  // CONVERT BGG COLLECTION DATA
  const convertBggDataInput = {
    xml: fetchBggDataResponse,
    options: { compact: true, spaces: 2 },
  };
  const convertBggDataResponse = await runStepFunction(
    "Convert BGG Collection Data",
    convertBggData,
    convertBggDataInput,
  );
  if (!convertBggDataResponse) return;

  // FORMAT CONVERTED COLLECTION DATA
  const formatDataResponse = await runStepFunction(
    "Format Collection Data",
    formatCollectionDataOrchestrator,
    fetchBggDataResponse,
  );
  if (!formatDataResponse) return;

  // SAVE FORMATTED COLLECTION DATA
  const saveFormattedDataResponse = await runStepFunction(
    "Save BGG Collection Data",
    saveBggData,
    formatDataResponse,
  );
  if (!saveFormattedDataResponse) return;

  // HYDRATE DATABASE
  await runStepFunction(
    "Hydrate Collection Data",
    hydrateDatabase,
    formatDataResponse,
  );
}
