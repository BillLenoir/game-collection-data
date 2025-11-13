import { extractEntities } from "../src/extract-entities.service";
import type {
  BggGameDataFromSingleCallJustTheGame,
  DataResponse,
  ExtractedEntities,
} from "../src/utils/data.types";

describe("extractEntities", () => {
  const gameWithEntitiesWeWant: BggGameDataFromSingleCallJustTheGame = {
    _attributes: {
      objectid: "111",
    },
    yearpublished: {
      _text: "2000",
    },
    minplayers: {
      _text: "1",
    },
    maxplayers: {
      _text: "5",
    },
    playingtime: {
      _text: "60",
    },
    minplaytime: {
      _text: "30",
    },
    maxplaytime: {
      _text: "120",
    },
    age: {
      _text: "12",
    },
    name: {
      _attributes: {
        sortindex: "",
        primary: "",
      },
      _text: "Game With Entities",
    },
    description: {
      _text: "Description",
    },
    thumbnail: {
      _text: "",
    },
    image: {
      _text: "",
    },
    boardgameexpansion: {
      _attributes: {
        objectid: "",
      },
      _text: "bbb",
    },
    boardgamehonor: {
      _attributes: {
        objectid: "",
      },
      _text: "ccc",
    },
    boardgameversion: {
      _attributes: {
        objectid: "",
      },
      _text: "ddd",
    },
    cardset: {
      _attributes: {
        objectid: "",
      },
      _text: "eee",
    },
    boardgameaccessory: {
      _attributes: {
        objectid: "",
      },
      _text: "fff",
    },
    videogamebg: {
      _attributes: {
        objectid: "",
      },
      _text: "hhh",
    },
    boardgameartist: {
      _attributes: {
        objectid: "111",
      },
      _text: "lll",
    },
    boardgameintegration: {
      _attributes: {
        objectid: "",
      },
      _text: "ooo",
    },
    poll: [
      {
        _attributes: {},
        results: [],
      },
    ],
  };

  const extractionWithEntities: DataResponse<ExtractedEntities> = {
    ok: true,
    data: [
      {
        bggId: "111",
        name: "lll",
        role: "Artist",
      },
    ],
    message: "Extracted entities for game: Game With Entities",
  };

  const gameWithOutEntitiesWeWant: BggGameDataFromSingleCallJustTheGame = {
    _attributes: {
      objectid: "111",
    },
    yearpublished: {
      _text: "2000",
    },
    minplayers: {
      _text: "1",
    },
    maxplayers: {
      _text: "5",
    },
    playingtime: {
      _text: "60",
    },
    minplaytime: {
      _text: "30",
    },
    maxplaytime: {
      _text: "120",
    },
    age: {
      _text: "12",
    },
    name: [
      {
        _attributes: {
          sortindex: "",
          primary: "",
        },
        _text: "Game Without Entities",
      },
      {
        _attributes: {
          sortindex: "",
          primary: "true",
        },
        _text: "Game with second name",
      },
    ],
    description: {
      _text: "Description",
    },
    thumbnail: {
      _text: "",
    },
    image: {
      _text: "",
    },
    boardgameexpansion: {
      _attributes: {
        objectid: "",
      },
      _text: "ppp",
    },
    boardgamehonor: {
      _attributes: {
        objectid: "",
      },
      _text: "qqq",
    },
    boardgameversion: {
      _attributes: {
        objectid: "",
      },
      _text: "rrr",
    },
    cardset: {
      _attributes: {
        objectid: "",
      },
      _text: "sss",
    },
    boardgameaccessory: {
      _attributes: {
        objectid: "",
      },
      _text: "ttt",
    },
    videogamebg: {
      _attributes: {
        objectid: "",
      },
      _text: "uuu",
    },
    boardgameintegration: {
      _attributes: {
        objectid: "",
      },
      _text: "www",
    },
    poll: [
      {
        _attributes: {},
        results: [],
      },
    ],
  };

  const extractionWithoutEntities: DataResponse<ExtractedEntities> = {
    ok: true,
    data: [],
    message: "Extracted entities for game: Game with second name",
  };

  describe("When provied gameData with entites that have roles we care about", () => {
    it("Returns an array of extracted entities", async () => {
      const testExtractEntities = await extractEntities(gameWithEntitiesWeWant);
      expect(testExtractEntities).toStrictEqual(extractionWithEntities);
    });
  });

  describe("When provied gameData with entites that have NO roles we care about", () => {
    it("Returns an empty array", async () => {
      const testExtractEntities = await extractEntities(
        gameWithOutEntitiesWeWant,
      );
      expect(testExtractEntities).toStrictEqual(extractionWithoutEntities);
    });
  });
});
