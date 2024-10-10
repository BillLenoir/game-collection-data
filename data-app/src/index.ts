import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { hydrateDatabase } from "./hydrate-database";
import { dataConfigs } from "./utils/data.config";
import { DataResponse } from "./utils/data.types";
import { logMessage } from "./utils/log-messages";

/**
 *
 * @param user, the BGG ID of the user whose collection the system is building this
 * @returns Nothing is returned, just status messages
 */
export async function generateCollectionData(
  user: string,
): Promise<DataResponse> {
  let bggCollectionData;
  try {
    bggCollectionData = await getCollectionData(user);
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `generateCollectionData > getCollectionData ERROR MESSAGE: ${error}`,
    };
  }
  if (!bggCollectionData || bggCollectionData.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `generateCollectionData > getCollectionData BGG ERROR: ${bggCollectionData.message}`,
    };
  }

  logMessage("HAPPY", bggCollectionData.message);

  let formattedCollectionData;
  try {
    formattedCollectionData = await formatCollectionData(
      bggCollectionData.data,
    );
  } catch (error) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `generateCollectionData > formattedCollectionData ERROR MESSAGE: ${error}`,
    };
  }

  if (
    !formattedCollectionData ||
    formattedCollectionData.successOrFailure === "FAIL"
  ) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `generateCollectionData > formattedCollectionData Processing ERROR: ${formattedCollectionData.message}`,
    };
  }

  logMessage("HAPPY", formattedCollectionData.message);

  const hydratedDatabase = await hydrateDatabase(formattedCollectionData.data);

  if (!hydratedDatabase || hydratedDatabase.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `generateCollectionData > hydrateDatabase ERROR MESSAGE: ${hydratedDatabase.message}`,
    };
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: "We're done!",
  };
}

// Handle the promise returned by generateCollectionData
const collectionDataOutcome: DataResponse = await generateCollectionData(
  dataConfigs.bggUser,
);
logMessage(
  "INFO",
  `FINAL MESSAGE: --> ${JSON.stringify(collectionDataOutcome)} <--`,
);
