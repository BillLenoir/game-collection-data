import fs from "fs";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse, SuccessOrFailure } from "./utils/data.types";
import { fetchData } from "./utils/fetch-data";

export async function getCollectionData(
  username: string,
): Promise<DataResponse> {
  let successOrFailure: SuccessOrFailure = "SUCCESS";
  let message = "";
  let response: DataResponse;

  try {
    response = await fetchData("collection", username);

    if (!response) {
      successOrFailure = "FAIL";
      message = "Something went wrong with the fetch.";
      return {
        data: "",
        successOrFailure,
        message,
      };
    }

    if (
      response.data.includes(
        "Your request for this collection has been accepted and will be processed",
      ) === true
    ) {
      successOrFailure = "FAIL";
      message =
        "Your request for this collection has been accepted and will be processed.  Please try again later for access.";
      return {
        data: response.data,
        successOrFailure,
        message,
      };
    }
  } catch (error) {
    successOrFailure = "FAIL";
    message = `${error}`;
    return {
      data: "",
      successOrFailure,
      message,
    };
  }

  const dataDirectory = dataConfigs.localData.dataDirectory;
  const rawResponseFile = dataConfigs.localData.rawResponseFile;

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  fs.writeFile(rawResponseFile, response.data, (error) => {
    if (error) {
      successOrFailure = "FAIL";
      message = `${error}`;
    } else {
      message = "I wrote the raw response XML file for the collection data!";
    }
  });

  return {
    data: response.data,
    successOrFailure,
    message,
  };
}
