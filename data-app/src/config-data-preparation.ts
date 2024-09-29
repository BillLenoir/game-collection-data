import { DataPrepConfigs } from './interfaces';

export const dataPrepConfigs: DataPrepConfigs = {
  BggUser: 'BillLenoir',

  // # GameOnly will save a single JSON file of game data
  // # EntityGame will have two files, one for entities and one for games
  SavedDataFormat: 'EntityGame',

  // # When set to false, the system will NOT hit the BGG API, but will use the already saved data
  NeedToFetch: true,

  // # When set to Locally, will save the JSON file local to the system
  // # Any other value will save the files to s3 bucket
  WhereToSave: 'Locally',
};
