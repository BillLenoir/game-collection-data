import type {
  DataResponse,
  FormatGameDataInput,
  GameData,
} from "../utils/data.types";

const asBoolean = (value?: string) => value === "1";

// Yes, I know this is NOT an asynchronous function,
//   but runStepFunction() requires it to be, and there's
//   no effect to calling this asynch.
export const formatGameData = async ({
  gameId,
  collectionData,
  gameData,
}: FormatGameDataInput): Promise<DataResponse<GameData>> => {
  return {
    ok: true,
    data: {
      id: String(gameId),
      bggId: collectionData._attributes.objectid ?? "",
      title: collectionData.name._text ?? "",
      yearPublished: collectionData.yearpublished?._text ?? "",
      thumbnail: collectionData.thumbnail?._text ?? "",
      description: gameData.boardgames.boardgame.description?._text ?? "",
      own: asBoolean(collectionData.status._attributes.own),
      wantToBuy: asBoolean(collectionData.status._attributes.want),
      previouslyOwned: asBoolean(collectionData.status._attributes.prevowned),
      forTrade: asBoolean(collectionData.status._attributes.fortrade),
    },
    message: "Game data processed successfully",
  };
};
