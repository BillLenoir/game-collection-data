import type { DataResponse, SuccessOrFailure } from "./data.types";

export async function fetchData(
  path: string,
  paramater: string | number,
): Promise<DataResponse> {
  let successOrFailure: SuccessOrFailure = "SUCCESS";
  let message = "";
  let response;

  const requestUrl = `https://boardgamegeek.com/xmlapi/${path}/${paramater}`;

  try {
    response = await fetch(requestUrl);

    if (!response) {
      successOrFailure = "FAIL";
      message = "Did not receive a response!";
      return {
        successOrFailure,
        message,
        data: `${response}`,
      };
    }

    response = await response.text();

    return {
      data: response,
      successOrFailure,
      message: "Received a response from BGG!",
    };
  } catch (error) {
    successOrFailure = "FAIL";
    message = `An error occurred during the fetch: ${error}`;
    return {
      successOrFailure,
      message,
      data: `${response}`,
    };
  }
}
