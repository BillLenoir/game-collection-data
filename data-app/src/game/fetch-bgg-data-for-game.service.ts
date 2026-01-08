import { dataConfigs } from "../utils/data.config";
import type { bggApiClientInput, DataResponse } from "../utils/data.types";

export const fetchBggDataForGame = async ({
  parameters,
}: bggApiClientInput): Promise<DataResponse> => {
  const requestUrl = `https://boardgamegeek.com/xmlapi/${encodeURIComponent(dataConfigs.bggUrlPaths.gameData)}/${encodeURIComponent(parameters)}`;

  try {
    const bggResponse = await fetch(requestUrl);

    const textBggResponse = await bggResponse.text();

    if (bggResponse.status >= 300) {
      return {
        ok: false,
        message: `BGG returned NOT ok (status: ${bggResponse.status})`,
      };
    }

    if (textBggResponse.includes("<boardgame ")) {
      return {
        ok: true,
        data: textBggResponse,
        message: `Received a response from BGG for game ID: ${parameters}!`,
      };
    }

    return {
      ok: false,
      message: `Received unexpected response from BGG for game ID: ${parameters} - ${textBggResponse}!`,
    };
  } catch (error) {
    const errorMessage = `The fetch threw an error for game ID: ${parameters} - ${error instanceof Error ? error.message : JSON.stringify(error)}`;
    return {
      ok: false,
      message: errorMessage,
    };
  }
};
