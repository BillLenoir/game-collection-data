import { PrismaClient } from "@prisma/client";
import {
  type DataResponse,
  type EntityData,
  type EntityGameDataSave,
  type GameData,
  type RelationshipData,
  type RoleData,
} from "./utils/data.types";
import { logMessage } from "./utils/log-messages";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

export async function hydrateDatabase(
  collectionData: string,
): Promise<DataResponse> {
  const deleteRelationships =
    await prisma.entityGameRoleRelationship.deleteMany({});
  logMessage(
    "INFO",
    `Deleted RELATIONSHIPS: ${JSON.stringify(deleteRelationships)}`,
  );

  const deleteGame = await prisma.game.deleteMany({});
  logMessage("INFO", `Deleted GAMES: ${JSON.stringify(deleteGame)}`);

  const deleteEntities = await prisma.entity.deleteMany({});
  logMessage("INFO", `Deleted ENTITIES: ${JSON.stringify(deleteEntities)}`);

  const deleteRoles = await prisma.role.deleteMany({});
  logMessage("INFO", `Deleted ROLES: ${JSON.stringify(deleteRoles)}`);

  const parsedCollectionData: EntityGameDataSave = JSON.parse(collectionData);

  // Insert Games
  const insertedGames = await insertGames(parsedCollectionData.gameData);
  if (!insertedGames || insertedGames.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `Insertion of games failed! ${insertedGames.message}`,
    };
  } else {
    logMessage("HAPPY", `Game insertion completed. ${insertedGames.message}`);
  }

  // Insert Entities
  const insertedEntities = await insertEntities(
    parsedCollectionData.entityData,
  );
  if (!insertedEntities || insertedEntities.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `Insertion of entities failed! ${insertedEntities.message}`,
    };
  } else {
    logMessage(
      "HAPPY",
      `Entity insertion completed. ${insertedEntities.message}`,
    );
  }

  // Insert Role
  const insertedRoles = await insertRoles(parsedCollectionData.roleData);
  if (!insertedRoles || insertedRoles.successOrFailure === "FAIL") {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `Insertion of roles failed! ${insertedRoles.message}`,
    };
  } else {
    logMessage("HAPPY", `Role insertion completed. ${insertedRoles.message}`);
  }

  // Insert Relationships
  const insertedRelationships = await insertRelationships(
    parsedCollectionData.relationshipData,
  );
  if (
    !insertedRelationships ||
    insertedRelationships.successOrFailure === "FAIL"
  ) {
    return {
      data: "",
      successOrFailure: "FAIL",
      message: `${insertedRelationships.message}\n${insertedRelationships.data}\n\n`,
    };
  } else {
    logMessage(
      "HAPPY",
      `Relationship insertion completed. ${insertedRelationships.message}`,
    );
  }

  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: "Successfully hydrated the database!",
  };
}

const insertGames = async (games: GameData[]): Promise<DataResponse> => {
  const gamesInserted = [];
  for (const game of games) {
    const hydrateGames = await prisma.game.create({
      data: {
        id: game.id,
        bggid: game.bggid,
        title: game.title,
        yearpublished: game.yearpublished,
        thumbnail: game.thumbnail,
        description: game.description,
        gameown: game.gameown,
        gamewanttobuy: game.gamewanttobuy,
        gameprevowned: game.gameprevowned,
        gamefortrade: game.gamefortrade,
      },
    });
    gamesInserted.push(hydrateGames);
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: `Number of games inserted: ${gamesInserted.length}`,
  };
};

const insertEntities = async (
  entities: EntityData[],
): Promise<DataResponse> => {
  const entitiesInserted = [];
  for (const entity of entities) {
    const hydrateEntities = await prisma.entity.create({
      data: {
        id: entity.id,
        bggid: entity.bggid,
        name: entity.name,
      },
    });
    entitiesInserted.push(hydrateEntities);
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: `Number of entities inserted: ${entitiesInserted.length}`,
  };
};

const insertRoles = async (roles: RoleData[]): Promise<DataResponse> => {
  const rolesInserted = [];
  for (const role of roles) {
    const hydrateRoles = await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
      },
    });
    rolesInserted.push(hydrateRoles);
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: `Number of entities inserted: ${rolesInserted.length}`,
  };
};

const insertRelationships = async (relationships: RelationshipData[]) => {
  const relationshipsInserted = [];
  for (const relationship of relationships) {
    let hydrateRelationships;

    try {
      hydrateRelationships = await prisma.entityGameRoleRelationship.create({
        data: {
          gameid: relationship.gameId,
          entityid: relationship.entityId,
          roleid: relationship.roleId,
        },
      });
    } catch (error) {
      return {
        data: `GAME: ${relationship.gameId} - ENTITY: ${relationship.entityId} - ROLE: ${relationship.roleId}`,
        successOrFailure: "FAIL",
        message: `Failed to insert releationhips: ${error}`,
      };
    }
    relationshipsInserted.push(hydrateRelationships);
  }
  return {
    data: "",
    successOrFailure: "SUCCESS",
    message: `Number of relationships inserted: ${relationshipsInserted.length}`,
  };
};
