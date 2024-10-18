import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { hydrateDatabase } from "./hydrate-database";
import { dataConfigs } from "./utils/data.config";
import { logMessage } from "./utils/log-messages";

/**
 *
 * @param user, the BGG ID of the user whose collection the system is building this
 * @returns Nothing is returned, just status messages
 */
export async function generateCollectionData(): Promise<void> {
  const user = dataConfigs.bggUser;
  let bggCollectionData;
  try {
    bggCollectionData = await getCollectionData(user);
  } catch (error) {
    logMessage(
      "ERROR",
      "FAIL!",
      `generateCollectionData > getCollectionData TRY FAILURE MESSAGE: ${error}`,
    );
  }
  if (!bggCollectionData || bggCollectionData.successOrFailure === "FAIL") {
    logMessage(
      "ERROR",
      "FAIL!",
      `generateCollectionData > getCollectionData BGG ERROR: ${bggCollectionData?.message ?? "no error message"}`,
    );
  } else {
    logMessage("HAPPY", bggCollectionData.message);

    let formattedCollectionData;
    try {
      formattedCollectionData = await formatCollectionData(
        bggCollectionData.data,
      );
    } catch (error) {
      logMessage(
        "ERROR",
        "FAIL!",
        `generateCollectionData > formattedCollectionData TRY FAILURE MESSAGE: ${error}`,
      );
    }

    if (
      !formattedCollectionData ||
      formattedCollectionData.successOrFailure === "FAIL"
    ) {
      logMessage(
        "ERROR",
        "FAIL!",
        `generateCollectionData > formattedCollectionData Processing ERROR: ${formattedCollectionData?.message ?? "no error message"}`,
      );
    } else {
      logMessage("HAPPY", formattedCollectionData.message);

      const hydratedDatabase = await hydrateDatabase(
        formattedCollectionData.data,
      );

      if (!hydratedDatabase || hydratedDatabase.successOrFailure === "FAIL") {
        logMessage(
          "ERROR",
          "FAIL!",
          `generateCollectionData > hydrateDatabase ERROR MESSAGE: ${hydratedDatabase.message}`,
        );
      }
      logMessage(
        "HAPPY",
        "Collection data successfully recorded in the database!",
      );
    }
  }
}

// Handle the promise returned by generateCollectionData
void generateCollectionData();
