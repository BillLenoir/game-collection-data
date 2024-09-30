import { z } from 'zod';

export const DataPrepConfigsZ = z.object({
  bggUser: z.string(),
  needToFetch: z.boolean(),
  whereToSave: z.enum(['Locally', 'S3']),
  localData: z.object({
    dataDirectory: z.string(),
    rawResponseFile: z.string(),
  }),
});
export type DataPrepConfigs = z.infer<typeof DataPrepConfigsZ>;

export const ComboEntityDataZ = z.object({
  id: z.number(),
  bggid: z.string(),
  name: z.string(),
});
export type ComboEntityData = z.infer<typeof ComboEntityDataZ>;

export const ComboGameDataZ = z.object({
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
export type ComboGameData = z.infer<typeof ComboGameDataZ>;

export const ComboRelationshipDataZ = z.object({
  gameid: z.number(),
  entityid: z.number(),
  relationshiptype: z.string(),
});
export type ComboRelationshipData = z.infer<typeof ComboRelationshipDataZ>;

export const EntityDataZ = z.object({
  _attributes: z.object({
    objectid: z.string(),
  }),
  _text: z.string(),
  relationshiptype: z.string(),
});
export type EntityData = z.infer<typeof EntityDataZ>;

export const EntityGameDataSaveZ = z.object({
  entitydata: z.array(ComboEntityDataZ),
  gamedata: z.array(ComboGameDataZ),
  relationshipdata: z.array(ComboRelationshipDataZ),
});
export type EntityGameDataSave = z.infer<typeof EntityGameDataSaveZ>;

export const GameOnlyDataZ = z.object({
  id: z.string(),
  title: z.string(),
  yearpublished: z.string(),
  thumbnail: z.string().nullable(),
  publisher: z.array(z.string()),
  designer: z.array(z.string()),
  description: z.string(),
  gameown: z.boolean(),
  gamewanttobuy: z.boolean(),
  gameprevowned: z.boolean(),
  gamefortrade: z.boolean(),
});
export type GameOnlyData = z.infer<typeof GameOnlyDataZ>;

const AttributesZ = z.object({
  _text: z.string(),
});

const ItemZ = z.object({
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

export const BggGameDataZ = z.object({
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
    item: z.array(ItemZ),
  }),
});
export type BggGameData = z.infer<typeof BggGameDataZ>;

export const GetCollectionDataResponse = z.object({
  response: z.string(),
  getDataSuccessful: z.boolean(),
  message: z.string(),
});
export type GetCollectionDataResponse = z.infer<typeof GetCollectionDataResponse>;

export const FormatCollectionDataResponse = z.object({
  response: z.string(),
  formatDataSuccessful: z.boolean(),
  message: z.string(),
});
export type FormatCollectionDataResponse = z.infer<typeof FormatCollectionDataResponse>;