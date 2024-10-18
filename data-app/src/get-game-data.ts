import type { DataResponse } from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";

export async function getGameData(bggGameId: string): Promise<DataResponse> {
  let gameResponse;
  try {
    gameResponse = await fetchData("boardgame", bggGameId);
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: JSON.stringify(error),
    };
  }

  if (!gameResponse || gameResponse.successOrFailure === "FAIL") {
    let thisMessage = `Something went wrong with the internal fetchData call for ID: ${bggGameId}.`;
    if (gameResponse.message) {
      thisMessage = gameResponse.message;
    }
    return {
      data: "",
      successOrFailure: "FAIL",
      message: thisMessage,
    };
  }

  return gameResponse;
}
