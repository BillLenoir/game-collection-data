import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { hydrateDatabase } from "./hydrate-database";
import { dataConfigs } from "./utils/data.config";
import { logMessage } from "./utils/log-messages";

/**
 *
 * @returns
 */
async function handleCollectionData() {
  try {
    const bggCollectionData = await getCollectionData(dataConfigs.bggUser);

    if (!bggCollectionData || bggCollectionData.successOrFailure === "FAIL") {
      logMessage(
        "ERROR",
        "getCollectionData Failed!",
        bggCollectionData.message,
      );
    }

    logMessage("HAPPY", bggCollectionData.message);

    const formattedCollectionData = await formatCollectionData(
      bggCollectionData.data,
    );

    if (
      !formattedCollectionData ||
      formattedCollectionData.successOrFailure === "FAIL"
    ) {
      logMessage(
        "ERROR",
        "formatCollectionData Failed!",
        formattedCollectionData.message,
      );
    }

    logMessage("HAPPY", formattedCollectionData.message);

    const hydratedDatabase = await hydrateDatabase(
      formattedCollectionData.data,
    );

    if (!hydratedDatabase || hydratedDatabase.successOrFailure === "FAIL") {
      return logMessage(
        "ERROR",
        "hydrateDatabase Failed!",
        hydratedDatabase.message,
      );
    }

    logMessage("HAPPY", "Looking good so far!");
  } catch (error) {
    logMessage(
      "ERROR",
      "An unexpected error occurred.",
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Handle the promise returned by handleCollectionData
void handleCollectionData();
