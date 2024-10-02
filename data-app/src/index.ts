import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { dataConfigs } from "./utils/data.config";
import { logMessage } from "./utils/log-messages";

/**
 *
 * @returns
 */
async function handleCollectionData() {
  try {
    const bggCollectionData = await getCollectionData(dataConfigs.bggUser);

    if (bggCollectionData.successOrFailure === "FAIL") {
      return logMessage(
        "ERROR",
        "getCollectionData Failed!",
        bggCollectionData.message,
      );
    }

    logMessage("INFO", bggCollectionData.message);

    const formattedCollectionData = await formatCollectionData(
      bggCollectionData.data,
    );

    if (formattedCollectionData.successOrFailure === "FAIL") {
      return logMessage(
        "ERROR",
        "formatCollectionData Failed!",
        formattedCollectionData.message,
      );
    }

    logMessage("INFO", "Looking good so far!");
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
