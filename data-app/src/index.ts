import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { hydrateDatabase } from "./hydrate-database";
import { dataConfigs } from "./utils/data.config";
import { logMessage } from "./utils/log-messages";

const user = dataConfigs.bggUser;
let bggCollectionData;
try {
  bggCollectionData = await getCollectionData(user);
} catch (error) {
  throw new Error(
    `generateCollectionData > getCollectionData TRY FAILURE MESSAGE: ${error}`,
  );
}
if (!bggCollectionData || bggCollectionData.successOrFailure === "FAIL") {
  throw new Error(
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
    throw new Error(
      `generateCollectionData > formattedCollectionData TRY FAILURE MESSAGE: ${error}`,
    );
  }

  if (
    !formattedCollectionData ||
    formattedCollectionData.successOrFailure === "FAIL"
  ) {
    throw new Error(
      `generateCollectionData > formattedCollectionData Processing ERROR: ${formattedCollectionData?.message ?? "no error message"}`,
    );
  } else {
    logMessage("HAPPY", formattedCollectionData.message);

    const hydratedDatabase = await hydrateDatabase(
      formattedCollectionData.data,
    );

    if (!hydratedDatabase || hydratedDatabase.successOrFailure === "FAIL") {
      throw new Error(
        `generateCollectionData > hydrateDatabase ERROR MESSAGE: ${hydratedDatabase.message}`,
      );
    }
    logMessage(
      "HAPPY",
      "Collection data successfully recorded in the database!",
    );
  }
}
