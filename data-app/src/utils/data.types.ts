import { z } from "zod";

// enums
export const SuccessOrFailureZ = z.enum(["SUCCESS", "FAIL"]);
export type SuccessOrFailure = z.infer<typeof SuccessOrFailureZ>;

export const LogMessageTypeZ = z.enum(["ERROR", "HAPPY", "INFO", "WARNING"]);
export type LogMessageType = z.infer<typeof LogMessageTypeZ>;

// system types
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

export const ExtractedEntityZ = z.object({
  id: z.string(),
  bggId: z.string(),
  name: z.string(),
  role: z.string(),
  existingEntity: z.boolean(),
});
export type ExtractedEntity = z.infer<typeof ExtractedEntityZ>;

export const ExtractedEntitiesZ = z.array(ExtractedEntityZ);
export type ExtractedEntities = z.infer<typeof ExtractedEntitiesZ>;

// System Data Types
export const EntityDataZ = z.object({
  id: z.string(),
  bggId: z.string(),
  name: z.string(),
});
export type EntityData = z.infer<typeof EntityDataZ>;

export const GameDataZ = z.object({
  id: z.string(),
  bggId: z.string(),
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
    inbound: z.string().optional(),
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

export const PollAttributesZ = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  totalvotes: z.string().optional(),
  numplayers: z.string().optional(),
  value: z.string().optional(),
  numvotes: z.string().optional(),
  level: z.string().optional(),
});
export type PollAttributes = z.infer<typeof PollAttributesZ>;

export const PollResultZ = z.union([
  z.object({
    _attributes: PollAttributesZ,
  }),
  z.array(
    z.object({
      _attributes: PollAttributesZ,
    }),
  ),
]);
export type PollResult = z.infer<typeof PollResultZ>;

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
  name: z.union([BggGameNameZ, z.array(BggGameNameZ)]),
  description: z.object({
    _text: z.string(),
  }),
  thumbnail: z.object({
    _text: z.string(),
  }),
  image: z.object({
    _text: z.string(),
  }),
  boardgamepublisher: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamepodcastepisode: z
    .union([BggEntityZ, z.array(BggEntityZ)])
    .optional(),
  boardgameexpansion: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamehonor: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgameversion: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  cardset: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgameaccessory: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamefamily: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  videogamebg: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamecategory: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamemechanic: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamedeveloper: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgameartist: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamedesigner: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgamesubdomain: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  boardgameintegration: z.union([BggEntityZ, z.array(BggEntityZ)]).optional(),
  poll: z.array(
    z.object({
      _attributes: PollAttributesZ,
      results: z.union([z.array(PollResultZ), z.object({})]),
    }),
  ),
  "poll-summary": z.object({}).optional(),
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
