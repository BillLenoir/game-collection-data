import { type DataPrepConfigs } from "./data.types";

export const dataConfigs: DataPrepConfigs = {
  // The id for the BGG user
  bggUser: "BillLenoir",

  // When set to false, the system will NOT hit the BGG API, but will use the already saved data
  needToFetch: true,

  // LOCAL: database will be saved locally
  // AWS: database will be saved to s3 bucket
  whereToSave: "Locally",

  // TODO: S3 bucket info

  // Settings for saving data locally
  localData: {
    dataDirectory: "./src/data/",
    rawResponseFile: "./src/data/rawResponse.xml",
  },
};
