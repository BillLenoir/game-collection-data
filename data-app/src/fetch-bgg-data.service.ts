import { callBggApi } from "./utils/bgg-api-client";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse } from "./utils/data.types";

export async function fetchDataFromBgg({
  path,
  parameters,
}: {
  path: string;
  parameters: string | number;
}): Promise<DataResponse> {
  const sleep = (waitTimeInMS: number) =>
    new Promise<void>((response) => setTimeout(response, waitTimeInMS));

  let { numberOfRetries, delayInMs } = dataConfigs.retry;
  let retryBggFetch = true;
  let bggResponse = await callBggApi({ path, parameters });

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
        bggResponse = await callBggApi({ path, parameters });
      } else {
        retryBggFetch = false;
      }
    }
  }

  return bggResponse;
}
