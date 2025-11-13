import { z } from "zod";

// ENUMS (that aren't enums because I don't use enums)
export type LogMessageType = "ERROR" | "HAPPY" | "INFO" | "WARNING";

// SYSTEM COMMUNICATION TYPES

export type StepFunction<I, T> = (input: I) => Promise<DataResponse<T>>;

export type GoodDataResponse<T> = {
  ok: true;
  data: T;
  message: string;
};

export type BadDataResponse = {
  ok: false;
  message: string;
};

export type DataResponse<T = string> = GoodDataResponse<T> | BadDataResponse;

export type DataPrepConfigs = {
  bggUserId: string;
  needToFetchFromBgg: boolean;
  whereToSave: "Locally" | "S3";
  localData: {
    dataDirectory: string;
    rawResponseFile: string;
    gameDataFile: string;
    entityDataFile: string;
    roleDataFile: string;
    relationshipDataFile: string;
  };
  retry: {
    numberOfRetries: number;
    delayInMs: number;
    queuedMessage: string;
  };
  numberOfGamesInBatch: number;
  rolesToExtract: Record<string, string>;
};

export type FetchDataFromBggInput = {
  path: string;
  parameters: string | number;
};

export type SaveBggDataInput = {
  dataToSave: string;
  directory: string;
  fileName: string;
};

export type ConvertBggDataInput = {
  xml: string;
  options: {
    compact: boolean;
    spaces: number;
  };
};

export type FormatGameDataInput = {
  gameId: string;
  collectionData: BggGameDataFromCollection;
  gameData: BggGameDataFromSingleCall;
};

// INTERNAL DATA TYPES
export type ExtractedEntity = {
  bggId: string;
  name: string;
  role: string;
};

export type ExtractedEntities = ExtractedEntity[];

export type EntityData = {
  id: string;
  bggId: string;
  name: string;
};

export type Entities = EntityData[];

export type GameData = {
  id: string;
  bggId: string;
  title: string;
  yearPublished: string;
  thumbnail: string;
  description: string;
  own: boolean;
  wantToBuy: boolean;
  previouslyOwned: boolean;
  forTrade: boolean;
};

export type RoleData = {
  id: string;
  name: string;
};

export type RelationshipData = {
  gameId: string;
  entityId: string;
  roleId: string;
};

export type EntityGameDataSave = {
  gameData: [GameData];
  entityData: [EntityData];
  roleData: [RoleData];
  relationshipData: [RelationshipData];
};

// BGG DATA TYPES
const AttributesZ = z.object({
  _text: z.string(),
});
const ValuesZ = z.object({
  value: z.string(),
});

const BggGameDataFromCollectionZ = z.object({
  _attributes: z.object({
    objecttype: z.string(),
    objectid: z.string(),
    subtype: z.string(),
    collid: z.string(),
  }),
  name: z.object({
    _attributes: z.object({
      sortindex: z.string(),
    }),
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
      _attributes: ValuesZ,
      usersrated: z.object({
        _attributes: ValuesZ,
      }),
      average: z.object({
        _attributes: ValuesZ,
      }),
      bayesaverage: z.object({
        _attributes: ValuesZ,
      }),
      stddev: z.object({
        _attributes: ValuesZ,
      }),
      median: z.object({
        _attributes: ValuesZ,
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
  comment: AttributesZ.optional(),
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
