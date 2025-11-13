import { dataConfigs } from "./utils/data.config";
import type {
  BggGameDataFromSingleCallJustTheGame,
  DataResponse,
  ExtractedEntities,
} from "./utils/data.types";

export const extractEntities = async (
  gameData: BggGameDataFromSingleCallJustTheGame,
): Promise<DataResponse<ExtractedEntities>> => {
  let extractedEntities: ExtractedEntities = [];
  const rolesToExtract = dataConfigs.rolesToExtract;

  for (const [key, value] of Object.entries(gameData)) {
    const roleName = rolesToExtract[key as keyof typeof rolesToExtract];
    if (!roleName) continue;

    const items = Array.isArray(value) ? value : [value];
    for (const entity of items) {
      extractedEntities.push({
        bggId: entity._attributes.objectid,
        name: entity._text ?? "",
        role: roleName,
      });
    }
  }

  const gameNames = Array.isArray(gameData.name)
    ? gameData.name
    : [gameData.name];
  let gameName;
  for (const name of gameNames) {
    gameName = name._text;
    if (name._attributes.primary) break;
  }

  return {
    ok: true,
    data: extractedEntities as ExtractedEntities,
    message: `Extracted entities for game: ${gameName}`,
  };
};
