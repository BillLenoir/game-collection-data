import { PrismaClient } from "@prisma/client";
import { DbReturnedGame } from "./data-types.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:../../data-app/prisma/dev.db",
    },
  },
});

export async function getListOfGameIds(
  filter: string,
  sort: string,
): Promise<{ id: string }[]> {
  const whereCondition = {
    [filter]: true,
  };

  const sortCondition = {
    [sort]: "asc",
  };

  return prisma.game.findMany({
    where: whereCondition,
    orderBy: sortCondition,
    select: {
      id: true,
    },
  });
}

export async function findGames(
  filter: string,
  startIndex: number,
  limit: number,
  sort: string,
): Promise<DbReturnedGame[]> {
  const whereCondition = {
    [filter]: true,
  };

  const sortCondition = {
    [sort]: "asc",
  };

  const foundGames: DbReturnedGame[] = await prisma.game.findMany({
    where: whereCondition,
    orderBy: sortCondition,
    take: limit,
    skip: startIndex,
    include: {
      entities: {
        include: {
          entity: true,
          role: true,
        },
      },
    },
  });

  return foundGames;
}

// console.log(JSON.stringify(await findGames("gameown", 39, 1, "yearpublished")));
