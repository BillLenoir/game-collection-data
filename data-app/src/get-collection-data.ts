import fs from "fs/promises";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse } from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";

export async function getCollectionData(
  username: string,
): Promise<DataResponse> {
  try {
    const response = await fetchData("collection", username);

    // Handle the case where response is null/undefined
    if (!response || response.successOrFailure === "FAIL") {
      return response;
    }

    const { dataDirectory, rawResponseFile } = dataConfigs.localData;

    // Create directory if it doesn't exist
    if (!(await fs.stat(dataDirectory).catch(() => false))) {
      await fs.mkdir(dataDirectory, { recursive: true });
    }

    // Write the data to a file asynchronously
    await fs.writeFile(rawResponseFile, response.data);

    return response;
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `Error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
