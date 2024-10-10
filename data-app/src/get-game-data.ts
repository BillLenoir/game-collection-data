import type { DataResponse } from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";

export async function getGameData(bggGameId: string): Promise<DataResponse> {
  try {
    const gameResponse = await fetchData("boardgame", bggGameId);

    if (!gameResponse || gameResponse.successOrFailure === "FAIL") {
      return {
        data: "",
        successOrFailure: "FAIL",
        message: `Something went wrong with the internal fetchData call for ID: ${bggGameId}.`,
      };
    }

    return gameResponse;
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `${error}`,
    };
  }
}
