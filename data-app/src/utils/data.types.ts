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
    relationshipDataFile: z.string(),
  }),
});
export type DataPrepConfigs = z.infer<typeof DataPrepConfigsZ>;

export const EntityDataZ = z.object({
  id: z.number(),
  bggid: z.string(),
  name: z.string(),
  type: z.string(),
});
export type EntityData = z.infer<typeof EntityDataZ>;

export const GameDataZ = z.object({
  id: z.number(),
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

export const RelationshipDataZ = z.object({
  gameId: z.number(),
  entityId: z.string(),
  relationshiptype: z.string(),
});
export type RelationshipData = z.infer<typeof RelationshipDataZ>;

export const BggEntityDataZ = z.object({
  _attributes: z.object({
    objectid: z.string(),
  }),
  _text: z.string(),
  relationshiptype: z.string(),
});
export type BggEntityData = z.infer<typeof BggEntityDataZ>;

export const EntityGameDataSaveZ = z.object({
  entitydata: z.array(EntityDataZ),
  gamedata: z.array(GameDataZ),
  relationshipdata: z.array(RelationshipDataZ),
});
export type EntityGameDataSave = z.infer<typeof EntityGameDataSaveZ>;

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

export const DataResponseZ = z.object({
  data: z.string(),
  successOrFailure: SuccessOrFailureZ,
  message: z.string(),
});
export type DataResponse = z.infer<typeof DataResponseZ>;
