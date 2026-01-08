import { dataConfigs } from "./data.config";
import type { DataResponse, bggApiClientInput } from "./data.types";

export const bggApiClient = async ({
  parameters,
}: bggApiClientInput): Promise<DataResponse> => {
  const requestUrl = `https://boardgamegeek.com/xmlapi/${dataConfigs.bggUrlPaths.gameData}/${encodeURIComponent(parameters)}`;

  try {
    const bggResponse = await fetch(requestUrl);

    const textBggResponse = await bggResponse.text();

    if (!bggResponse.ok) {
      return {
        ok: false,
        message: `BGG returned NOT ok for ${parameters}: ${textBggResponse}`,
      };
    }

    if (textBggResponse.includes("<item")) {
      return {
        ok: true,
        data: textBggResponse,
        message: "Received a response from BGG!",
      };
    }

    return {
      ok: false,
      message: `Received unexpected response from BGG: ${textBggResponse}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
};
