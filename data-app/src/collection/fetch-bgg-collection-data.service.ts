import { bggApiClient } from "../utils/bgg-api-client";
import { dataConfigs } from "../utils/data.config";
import type { DataResponse, bggApiClientInput } from "../utils/data.types";

export const fetchCollectionDataFromBgg = async ({
  path,
  parameters,
}: bggApiClientInput): Promise<DataResponse> => {
  const sleep = (waitTimeInMS: number) =>
    new Promise<void>((response) => setTimeout(response, waitTimeInMS));

  let { numberOfRetries, delayInMs } = dataConfigs.retry;
  let retryBggFetch = true;
  let bggResponse = await bggApiClient({ path, parameters });

  while (retryBggFetch) {
    if (bggResponse.ok) {
      retryBggFetch = false;
    } else {
      if (
        bggResponse.message === "BGG said to try again" &&
        numberOfRetries > 0
      ) {
        numberOfRetries--;
        await sleep(delayInMs);
        bggResponse = await bggApiClient({ path, parameters });
      } else {
        retryBggFetch = false;
      }
    }
  }

  return bggResponse;
};
