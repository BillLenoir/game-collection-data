import fs from "fs/promises";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse } from "./utils/data.types";

export async function saveBggData(dataToSave: string): Promise<DataResponse> {
  const { dataDirectory, rawResponseFile } = dataConfigs.localData;

  try {
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(rawResponseFile, dataToSave);
    return {
      ok: true,
      data: "No data to report",
      message: "Successfully saved the BGG data!",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
}
