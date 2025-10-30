import { fetchData } from "./fetch-bgg-data.service";
import type { DataResponse } from "./utils/data.types";

export async function getGameData(bggGameId: string): Promise<DataResponse> {
  let gameResponse;
  try {
    gameResponse = await fetchData("boardgame", bggGameId);
  } catch (error) {
    return {
      data: "",
      ok: "FAIL",
      message: JSON.stringify(error),
    };
  }

  if (!gameResponse || gameResponse.ok === "FAIL") {
    let thisMessage = `Something went wrong with the internal fetchData call for ID: ${bggGameId}.`;
    if (gameResponse.message) {
      thisMessage = gameResponse.message;
    }
    return {
      data: "",
      ok: "FAIL",
      message: thisMessage,
    };
  }

  return gameResponse;
}
