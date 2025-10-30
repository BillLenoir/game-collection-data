import { type DataPrepConfigs } from "./data.types";

export const dataConfigs: DataPrepConfigs = {
  bggUserId: "BillLenoir",

  needToFetchFromBgg: true,

  whereToSave: "Locally",

  localData: {
    dataDirectory: "./src/data/",
    rawResponseFile: "./src/data/rawResponse.xml",
    gameDataFile: "./src/data/game-data.json",
    entityDataFile: "./src/data/entity-data.json",
    roleDataFile: "./src/data/role-data.json",
    relationshipDataFile: "./src/data/relationship-data.json",
  },

  retry: {
    numberOfRetries: 1,
    delayInMs: 10000,
    queuedMessage:
      "Your request for this collection has been accepted and will be processed",
  },
};
