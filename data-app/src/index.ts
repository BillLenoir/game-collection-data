import { formatCollectionData } from "./format-collection-data";
import { getCollectionData } from "./get-collection-data";
import { dataConfigs } from "./utils/data.config";
import type { DataResponse } from "./utils/data.types";

const bggCollectionData: DataResponse = await getCollectionData(
  dataConfigs.bggUser,
);

if (bggCollectionData.successOrFailure === "FAIL") {
  console.error("\x1b[31m%s\x1b[0m", "getCollectionData Failed!");
  console.error("\x1b[31m%s\x1b[0m", bggCollectionData.message);
} else {
  const formatttedCollectionData: DataResponse = await formatCollectionData(
    bggCollectionData.data,
  );
  if (formatttedCollectionData.successOrFailure === "FAIL") {
    console.error("\x1b[31m%s\x1b[0m", "formattCollectionData Failed!");
    console.error("\x1b[31m%s\x1b[0m", formatttedCollectionData.message);
  } else {
    console.log("\x1b[32m%s\x1b[0m", "Looking good so far!");
  }
}
