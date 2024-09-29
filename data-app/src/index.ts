import { dataPrepConfigs } from './config-data-preparation';
import { prepareData } from './data-preparation';

const gameDataPromise = await prepareData(dataPrepConfigs.BggUser);

const gameData = JSON.stringify(gameDataPromise);

console.log(gameData);