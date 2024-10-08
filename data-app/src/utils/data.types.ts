import { z } from "zod";

export const SuccessOrFailureZ = z.enum(["SUCCESS", "FAIL"]);
export type SuccessOrFailure = z.infer<typeof SuccessOrFailureZ>;

export const LogMessageTypeZ = z.enum(["ERROR", "HAPPY", "INFO", "WARNING"]);
export type LogMessageType = z.infer<typeof LogMessageTypeZ>;

export const DataPrepConfigsZ = z.object({
  bggUser: z.string(),
  needToFetch: z.boolean(),
  whereToSave: z.enum(["Locally", "S3"]),
  localData: z.object({
    dataDirectory: z.string(),
    rawResponseFile: z.string(),
    gameDataFile: z.string(),
    entityDataFile: z.string(),
    roleDataFile: z.string(),
    relationshipDataFile: z.string(),
  }),
});
export type DataPrepConfigs = z.infer<typeof DataPrepConfigsZ>;

export const DataResponseZ = z.object({
  data: z.string(),
  successOrFailure: SuccessOrFailureZ,
  message: z.string(),
});
export type DataResponse = z.infer<typeof DataResponseZ>;

// System Data Types
export const EntityDataZ = z.object({
  id: z.string(),
  bggid: z.string(),
  name: z.string(),
});
export type EntityData = z.infer<typeof EntityDataZ>;

export const GameDataZ = z.object({
  id: z.string(),
  bggid: z.string(),
  title: z.string(),
  yearpublished: z.string(),
  thumbnail: z.string(),
  description: z.string(),
  gameown: z.boolean(),
  gamewanttobuy: z.boolean(),
  gameprevowned: z.boolean(),
  gamefortrade: z.boolean(),
});
export type GameData = z.infer<typeof GameDataZ>;

export const RoleDataZ = z.object({
  id: z.string(),
  name: z.string(),
});
export type RoleData = z.infer<typeof RoleDataZ>;

export const RelationshipDataZ = z.object({
  gameId: z.string(),
  entityId: z.string(),
  roleId: z.string(),
});
export type RelationshipData = z.infer<typeof RelationshipDataZ>;

export const EntityGameDataSaveZ = z.object({
  gameData: z.array(GameDataZ),
  entityData: z.array(EntityDataZ),
  roleData: z.array(RoleDataZ),
  relationshipData: z.array(RelationshipDataZ),
});
export type EntityGameDataSave = z.infer<typeof EntityGameDataSaveZ>;

// BGG Data Types
const AttributesZ = z.object({
  _text: z.string(),
});

const BggGameDataFromCollectionZ = z.object({
  _attributes: z.object({
    objecttype: z.string(),
    objectid: z.string(),
    subtype: z.string(),
    collid: z.string(),
  }),
  name: z.object({
    _attributes: AttributesZ,
    _text: z.string(),
  }),
  yearpublished: z.optional(AttributesZ),
  image: AttributesZ,
  thumbnail: z.optional(AttributesZ),
  stats: z.object({
    _attributes: z.object({
      minplayers: z.string(),
      maxplayers: z.string(),
      minplaytime: z.string(),
      maxplaytime: z.string(),
      playingtime: z.string(),
      numowned: z.string(),
    }),
    rating: z.object({
      _attributes: AttributesZ,
      usersrated: z.object({
        _attributes: AttributesZ,
      }),
      average: z.object({
        _attributes: AttributesZ,
      }),
      bayesaverage: z.object({
        _attributes: AttributesZ,
      }),
      stddev: z.object({
        _attributes: AttributesZ,
      }),
      median: z.object({
        _attributes: AttributesZ,
      }),
    }),
  }),
  status: z.object({
    _attributes: z.object({
      own: z.string(),
      prevowned: z.string(),
      fortrade: z.string(),
      want: z.string(),
      wanttoplay: z.string(),
      wanttobuy: z.string(),
      wishlist: z.string(),
      preordered: z.string(),
      lastmodified: z.string(),
    }),
  }),
  numplays: AttributesZ,
});
export type BggGameDataFromCollection = z.infer<
  typeof BggGameDataFromCollectionZ
>;

export const BggEntityZ = z.object({
  _attributes: z.object({
    objectid: z.string(),
  }),
  _text: z.string(),
});
export type BggEntity = z.infer<typeof BggEntityZ>;

export const BggCollectionDataZ = z.object({
  _declaration: z.object({
    _attributes: z.object({
      version: z.string(),
      encoding: z.string(),
      standalone: z.string(),
    }),
  }),
  items: z.object({
    _attributes: z.object({
      totalitems: z.string(),
      termsofuse: z.string(),
      pubdate: z.string(),
    }),
    item: z.array(BggGameDataFromCollectionZ),
  }),
});
export type BggCollectionData = z.infer<typeof BggCollectionDataZ>;

export const BggGameNameZ = z.object({
  _attributes: z.object({
    primary: z.string(),
    sortindex: z.string(),
  }),
  _text: z.string(),
});
export type BggGameName = z.infer<typeof BggGameNameZ>;

export const BggPollResultZ = z.object({
  _attributes: z.object({
    level: z.string(),
    value: z.string(),
    numvotes: z.string(),
  }),
});
export type BggPollResult = z.infer<typeof BggPollResultZ>;

export const BggPollZ = z.object({
  _attributes: z.object({
    name: z.string(),
    title: z.string(),
    totalvotes: z.string(),
  }),
  results: z.object({
    result: z.array(BggPollResultZ),
  }),
});
export type BggPoll = z.infer<typeof BggPollZ>;

export const BggGameDataFromSingleCallJustTheGameZ = z.object({
  _attributes: z.object({
    objectid: z.string(), // the bggId
  }),
  yearpublished: z.object({
    _text: z.string(),
  }),
  minplayers: z.object({
    _text: z.string(),
  }),
  maxplayers: z.object({
    _text: z.string(),
  }),
  playingtime: z.object({
    _text: z.string(),
  }),
  minplaytime: z.object({
    _text: z.string(),
  }),
  maxplaytime: z.object({
    _text: z.string(),
  }),
  age: z.object({
    _text: z.string(),
  }),
  name: z.array(BggGameNameZ),
  description: z.object({
    _text: z.string(),
  }),
  thumbnail: z.object({
    _text: z.string(),
  }),
  image: z.object({
    _text: z.string(),
  }),
  boardgamepublisher: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamepodcastepisode: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgameexpansion: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamehonor: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgameversion: z.union([BggEntityZ, z.array(BggEntityZ)]),
  cardset: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgameaccessory: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamefamily: z.union([BggEntityZ, z.array(BggEntityZ)]),
  videogamebg: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamecategory: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamemechanic: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamedeveloper: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgameartist: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamedesigner: z.union([BggEntityZ, z.array(BggEntityZ)]),
  boardgamesubdomain: z.union([BggEntityZ, z.array(BggEntityZ)]),
  poll: z.union([BggPollZ, z.array(BggPollZ)]),
});
export type BggGameDataFromSingleCallJustTheGame = z.infer<
  typeof BggGameDataFromSingleCallJustTheGameZ
>;

export const BggGameDataFromSingleCallZ = z.object({
  boardgames: z.object({
    _attributes: z.object({
      termsofuse: z.string(),
    }),
    boardgame: BggGameDataFromSingleCallJustTheGameZ,
  }),
});
export type BggGameDataFromSingleCall = z.infer<
  typeof BggGameDataFromSingleCallZ
>;
