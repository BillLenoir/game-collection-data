import { z } from "zod";

// ENUMS (that aren't enums because I don't use enums)
export type LogMessageType = "ERROR" | "HAPPY" | "INFO" | "WARNING";

// SYSTEM COMMUNICATION TYPES

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

// allow sync OR async implementations
export type StepFunction<I, T> = (
  input: I,
) => DataResponse<T> | Promise<DataResponse<T>>;

export type DataPrepConfigs = {
  bggUserId: string;
  needToFetchFromBgg: boolean;
  whereToSave: "Locally" | "S3";
  bggUrlPaths: {
    collectionData: string;
    gameData: string;
  };
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

export type bggApiClientInput = {
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

export type ProcessRolesInput = {
  extractedEntities: ExtractedEntities;
  gameId: string;
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
  gameData: GameData[];
  entityData: EntityData[];
  roleData: RoleData[];
  relationshipData: RelationshipData[];
};

// BGG DATA TYPES – SHARED HELPERS

const AttributesZ = z.object({
  _text: z.string(),
});

// Alias for readability where we care about a simple text node
const TextNodeZ = AttributesZ;

const ValuesZ = z.object({
  value: z.string(),
});

// Small helper: value or array of values
const singleOrArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.array(schema)]);

// REGULAR ENTITY

export const BggRegularEntityZ = z.object({
  _attributes: z.object({
    objectid: z.string(),
    inbound: z.string().optional(),
  }),
  _text: z.string(),
});
export type BggRegularEntity = z.infer<typeof BggRegularEntityZ>;

// Helper for regular-entity relationships
const RegularEntityOrArrayZ = singleOrArray(BggRegularEntityZ);

// COLLECTION TYPES (multiple games from /collection)

// Common sub-schemas used by collection stats/rating

const RatingMetricZ = z.object({
  _attributes: ValuesZ,
});

const CollectionStatsAttributesZ = z.object({
  minplayers: z.string(),
  maxplayers: z.string(),
  minplaytime: z.string(),
  maxplaytime: z.string(),
  playingtime: z.string(),
  numowned: z.string(),
});

const CollectionRatingZ = z.object({
  _attributes: ValuesZ,
  usersrated: RatingMetricZ,
  average: RatingMetricZ,
  bayesaverage: RatingMetricZ,
  stddev: RatingMetricZ,
  median: RatingMetricZ,
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
  yearpublished: TextNodeZ.optional(),
  image: TextNodeZ,
  thumbnail: TextNodeZ.optional(),
  stats: z.object({
    _attributes: CollectionStatsAttributesZ,
    rating: CollectionRatingZ,
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
  numplays: TextNodeZ,
  comment: TextNodeZ.optional(),
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

// SINGLE-CALL GAME TYPES (from /boardgame)

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

// REQUIRED part of the single-call game data: just the id
const RequiredGameCoreZ = z.object({
  _attributes: z.object({
    objectid: z.string(), // the bggId
  }),
});

// OPTIONAL fields for the single-call game data
const OptionalGameFieldsZ = z
  .object({
    // scalar-ish fields
    yearpublished: TextNodeZ,
    minplayers: TextNodeZ,
    maxplayers: TextNodeZ,
    playingtime: TextNodeZ,
    minplaytime: TextNodeZ,
    maxplaytime: TextNodeZ,
    age: TextNodeZ,

    name: singleOrArray(BggGameNameZ),

    description: TextNodeZ,
    thumbnail: TextNodeZ,
    image: TextNodeZ,

    // relationship / entity fields
    boardgamepublisher: RegularEntityOrArrayZ,
    boardgamepodcastepisode: RegularEntityOrArrayZ,
    boardgameexpansion: RegularEntityOrArrayZ,
    boardgamehonor: RegularEntityOrArrayZ,
    boardgameversion: RegularEntityOrArrayZ,
    cardset: RegularEntityOrArrayZ,
    boardgameaccessory: RegularEntityOrArrayZ,
    boardgamefamily: RegularEntityOrArrayZ,
    videogamebg: RegularEntityOrArrayZ,
    boardgamecategory: RegularEntityOrArrayZ,
    boardgamemechanic: RegularEntityOrArrayZ,
    boardgamedeveloper: RegularEntityOrArrayZ,
    boardgameartist: RegularEntityOrArrayZ,
    boardgamedesigner: RegularEntityOrArrayZ,
    boardgamesubdomain: RegularEntityOrArrayZ,
    boardgameintegration: RegularEntityOrArrayZ,

    poll: z.array(
      z.object({
        _attributes: PollAttributesZ,
        results: z.union([z.array(PollResultZ), z.object({})]),
      }),
    ),

    "poll-summary": z.unknown(),
  })
  .partial(); // everything in this object is optional

// Final schema for the "just the game" data from a single call
export const BggGameDataFromSingleCallJustTheGameZ =
  RequiredGameCoreZ.merge(OptionalGameFieldsZ);

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
