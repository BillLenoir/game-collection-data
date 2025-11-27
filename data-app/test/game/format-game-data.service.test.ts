import { formatGameData } from "../../src/game/format-game-data.service";
import { asFlag } from "../../src/utils/as-flag";
import type {
  BggGameDataFromCollection,
  BggGameDataFromSingleCall,
  GameData,
} from "../../src/utils/data.types";

jest.mock("../../src/utils/as-flag", () => ({
  asFlag: jest.fn((value?: string) => value === "1"),
}));

function makeCollectionData(
  overrides: Partial<BggGameDataFromCollection> = {},
): BggGameDataFromCollection {
  return {
    _attributes: {
      objecttype: "thing",
      objectid: "123",
      subtype: "boardgame",
      collid: "999",
    },
    name: {
      _attributes: {
        sortindex: "1",
      },
      _text: "Test Game",
    },
    yearpublished: { _text: "2020" },
    image: { _text: "http://example.com/image-full.jpg" },
    thumbnail: { _text: "http://example.com/thumb.jpg" },
    stats: {
      _attributes: {
        minplayers: "1",
        maxplayers: "4",
        minplaytime: "30",
        maxplaytime: "60",
        playingtime: "45",
        numowned: "42",
      },
      rating: {
        _attributes: { value: "0" },
        usersrated: { _attributes: { value: "10" } },
        average: { _attributes: { value: "7.5" } },
        bayesaverage: { _attributes: { value: "7.0" } },
        stddev: { _attributes: { value: "1.0" } },
        median: { _attributes: { value: "0" } },
      },
    },
    status: {
      _attributes: {
        own: "1",
        prevowned: "0",
        fortrade: "0",
        want: "1",
        wanttoplay: "0",
        wanttobuy: "1",
        wishlist: "0",
        preordered: "0",
        lastmodified: "2024-01-01",
      },
    },
    numplays: { _text: "3" },
    comment: undefined,
    ...overrides,
  };
}

function makeSingleCallData(
  overrides: Partial<BggGameDataFromSingleCall> = {},
): BggGameDataFromSingleCall {
  return {
    boardgames: {
      _attributes: {
        termsofuse: "test-terms",
      },
      boardgame: {
        _attributes: {
          objectid: "123",
        },
        description: {
          _text: "Long game description",
        },
      },
    },
    ...overrides,
  };
}

describe("formatGameData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps core fields and flags correctly", () => {
    const collectionData = makeCollectionData();
    const gameData = makeSingleCallData();

    const result = formatGameData({
      gameId: "GAME-1",
      collectionData,
      gameData,
    });

    expect(result.ok).toBe(true);
    expect(result.message).toBe("Game data processed successfully");

    if (!result.ok) {
      throw new Error(`Expect OK to be true, but got false: ${result.message}`);
    }
    const data = result.data as GameData;

    expect(data.id).toBe("GAME-1");
    expect(data.bggId).toBe("123");
    expect(data.title).toBe("Test Game");
    expect(data.yearPublished).toBe("2020");
    expect(data.thumbnail).toBe("http://example.com/thumb.jpg");
    expect(data.description).toBe("Long game description");

    expect(asFlag).toHaveBeenCalledTimes(4);
    expect(asFlag).toHaveBeenCalledWith("1"); // own
    expect(asFlag).toHaveBeenCalledWith("1"); // want
    expect(asFlag).toHaveBeenCalledWith("0"); // prevowned
    expect(asFlag).toHaveBeenCalledWith("0"); // fortrade

    expect(data.own).toBe(true);
    expect(data.wantToBuy).toBe(true);
    expect(data.previouslyOwned).toBe(false);
    expect(data.forTrade).toBe(false);
  });

  it("uses empty strings when optional fields are missing", () => {
    const collectionData = makeCollectionData({
      yearpublished: undefined,
      thumbnail: undefined,
    });

    const gameData = makeSingleCallData({
      boardgames: {
        _attributes: {
          termsofuse: "test-terms",
        },
        boardgame: {
          _attributes: {
            objectid: "123",
          },
          // description omitted on purpose
        },
      },
    });

    const result = formatGameData({
      gameId: "GAME-2",
      collectionData,
      gameData,
    });

    if (!result.ok) {
      throw new Error(`Expect OK to be true, but got false: ${result.message}`);
    }
    const data = result.data as GameData;

    expect(data.yearPublished).toBe("");
    expect(data.thumbnail).toBe("");
    expect(data.description).toBe("");
  });

  it("passes the exact status flags to asFlag", () => {
    const collectionData = makeCollectionData({
      status: {
        _attributes: {
          own: "0",
          prevowned: "1",
          fortrade: "1",
          want: "0",
          wanttoplay: "0",
          wanttobuy: "0",
          wishlist: "0",
          preordered: "0",
          lastmodified: "2024-01-02",
        },
      },
    });

    const gameData = makeSingleCallData();

    const result = formatGameData({
      gameId: "GAME-3",
      collectionData,
      gameData,
    });

    if (!result.ok) {
      throw new Error(`Expect OK to be true, but got false: ${result.message}`);
    }
    const data = result.data as GameData;

    // Verify the calls to asFlag in order
    expect(asFlag).toHaveBeenNthCalledWith(1, "0"); // own
    expect(asFlag).toHaveBeenNthCalledWith(2, "0"); // want
    expect(asFlag).toHaveBeenNthCalledWith(3, "1"); // prevowned
    expect(asFlag).toHaveBeenNthCalledWith(4, "1"); // fortrade

    // And the derived booleans
    expect(data.own).toBe(false);
    expect(data.wantToBuy).toBe(false);
    expect(data.previouslyOwned).toBe(true);
    expect(data.forTrade).toBe(true);
  });
});
