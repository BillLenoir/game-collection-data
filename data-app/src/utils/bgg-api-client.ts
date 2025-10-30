import { BadDataResponse, GoodDataResponse } from "./data.types";

export const callBggApi = async ({
  path,
  parameters,
}: {
  path: string;
  parameters: string | number;
}) => {
  let fetchDataResponse;
  const requestUrl = `https://boardgamegeek.com/xmlapi/${path}/${encodeURIComponent(parameters)}`;

  try {
    const bggResponse = await fetch(requestUrl);

    const textBggResponse = await bggResponse.text();

    if (!bggResponse.ok) {
      fetchDataResponse = {
        ok: false,
        message: `BGG returned NOT ok: ${textBggResponse}`,
      } as BadDataResponse;
    } else if (
      textBggResponse.includes(
        "Your request for this collection has been accepted and will be processed",
      ) === true
    ) {
      fetchDataResponse = {
        ok: false,
        message: `BGG said to try again`,
      } as BadDataResponse;
    } else if (textBggResponse.includes("<item")) {
      fetchDataResponse = {
        ok: true,
        data: textBggResponse,
        message: "Received a response from BGG!",
      } as GoodDataResponse;
    } else {
      fetchDataResponse = {
        ok: false,
        message: `Received unexpected response from BGG: ${textBggResponse}`,
      } as BadDataResponse;
    }
  } catch (error) {
    fetchDataResponse = {
      ok: false,
      message: error instanceof Error ? error.message : JSON.stringify(error),
    } as BadDataResponse;
  }

  return fetchDataResponse;
};
