import type { DataResponse } from "./data.types";

export async function fetchData(
  path: string,
  paramater: string | number,
): Promise<DataResponse> {
  const requestUrl = `https://boardgamegeek.com/xmlapi/${path}/${paramater}`;

  try {
    const rawResponse = await fetch(requestUrl);

    // Handle the case where response is null/undefined
    if (!rawResponse) {
      return {
        data: `${rawResponse}`,
        successOrFailure: "FAIL",
        message: "Did not receive a response from BGG!",
      };
    }

    const response = await rawResponse.text();

    if (
      response.includes(
        "Your request for this collection has been accepted and will be processed",
      ) === true
    ) {
      return {
        data: response,
        successOrFailure: "FAIL",
        message:
          "Your request for this collection has been accepted and will be processed.  Please try again later for access.",
      };
    }

    return {
      data: response,
      successOrFailure: "SUCCESS",
      message: "Received a response from BGG!",
    };
  } catch (error) {
    return {
      successOrFailure: "FAIL",
      message: `An error occurred during the fetch: ${error}`,
      data: "",
    };
  }
}
