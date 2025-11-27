import { asFlag } from "../utils/as-flag";
import type {
  DataResponse,
  FormatGameDataInput,
  GameData,
} from "../utils/data.types";

export const formatGameData = ({
  gameId,
  collectionData,
  gameData,
}: FormatGameDataInput): DataResponse<GameData> => {
  const {
    _attributes: { objectid },
    name,
    yearpublished,
    thumbnail,
    status,
  } = collectionData;

  const descriptionNode = gameData.boardgames.boardgame.description;

  return {
    ok: true,
    data: {
      id: gameId,
      bggId: objectid ?? "",
      title: name._text ?? "",
      yearPublished: yearpublished?._text ?? "",
      thumbnail: thumbnail?._text ?? "",
      description: descriptionNode?._text ?? "",
      own: asFlag(status._attributes.own),
      wantToBuy: asFlag(status._attributes.want),
      previouslyOwned: asFlag(status._attributes.prevowned),
      forTrade: asFlag(status._attributes.fortrade),
    },
    message: "Game data processed successfully",
  };
};
