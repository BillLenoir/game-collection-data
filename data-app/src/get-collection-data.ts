import fs from "fs/promises";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse } from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";
import { writeToFile } from "./utils/write-to-file";

export async function getCollectionData(
  username: string,
): Promise<DataResponse> {
  let response;
  try {
    response = await fetchData("collection", username);
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `getCollectionData ERROR MESSAGE: --> ${error} <--`,
    };
  }

  // Handle the case where response is null/undefined
  if (!response || response.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: response.message ?? "No response from BGG call.",
    };
  }

  const { dataDirectory, rawResponseFile } = dataConfigs.localData;

  // Create directory if it doesn't exist
  if (!(await fs.stat(dataDirectory).catch(() => false))) {
    await fs.mkdir(dataDirectory, { recursive: true });
  }

  // Write the data to a file asynchronously
  await writeToFile(rawResponseFile, response.data);

  return response;
}
