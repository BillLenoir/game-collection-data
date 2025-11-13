import fs from "fs/promises";
import type { DataResponse, SaveBggDataInput } from "./utils/data.types";

export const saveBggData = async ({
  dataToSave,
  directory,
  fileName,
}: SaveBggDataInput): Promise<DataResponse> => {
  try {
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fileName, dataToSave);
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
};
