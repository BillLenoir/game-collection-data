import { collectionDataOrchestrator } from "./collection-data.orchestrator";
import { logMessage } from "./utils/log-messages";

collectionDataOrchestrator().catch((error) => {
  logMessage("ERROR", error instanceof Error ? error.message : String(error));
});
