import fs from "fs/promises";
import convert from "xml-js";
import { dataConfigs } from "./data.config";
import { logMessage } from "./log-messages";

const gameId = "5";
const filePath = `${dataConfigs.localData.dataDirectory}game-data/game-${gameId}.xml`;
let gameData;
let convertGameXmlToJson;
let parsedGameData;

try {
  gameData = await fs.readFile(filePath, "utf-8");
} catch (error) {
  logMessage("ERROR", `Failed to read file: ${error}`);
}

if (gameData) {
  convertGameXmlToJson = convert.xml2json(gameData, {
    compact: true,
    spaces: 2,
  });
  parsedGameData = JSON.parse(convertGameXmlToJson);
} else {
  logMessage("ERROR", "There's no game data!");
}

if (parsedGameData) {
  logMessage("HAPPY", JSON.stringify(parsedGameData));
} else {
  logMessage("ERROR", "The game data didn't convert!");
}
