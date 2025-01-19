import type { Cursor, DbReturnedGame } from "./data-types.js";
import { getListOfGameIds, findGames } from "./repository.js";
import {
  Game,
  Resolvers,
  GameConnection,
  GameNode,
} from "./resolvers-types.js";
import { getEncodedCursor } from "./utils/get-encoded-cursor.js";

// This checks each game to see if it passes the filter check
// based on the game's relationship to Billy's collection.
export const filterCheck = (filter: string) => {
  // Example cursor: "eyAibCI6IDUwLCAicyI6ICJJRCIsICJmIjogIk9XTiIgfSA="
  let includedGame: (game: Game) => boolean = () => true;
  if (filter === "OWN") {
    includedGame = (game: Game) => game.gameown === true;
  } else if (filter === "WANT") {
    includedGame = (game: Game) => game.gamewanttobuy === true;
  } else if (filter === "PREVOWN") {
    includedGame = (game: Game) => game.gameprevowned === true;
  } else if (filter === "TRADE") {
    includedGame = (game: Game) => game.gamefortrade === true;
  }
  return includedGame;
};

export const resolvers: Resolvers = {
  Query: {
    async findGames(
      _parent: any,
      args: { cursor: string },
    ): Promise<GameConnection> {
      // Parsing the arguments
      const params: Cursor = JSON.parse(atob(args.cursor));

      // filtering
      const filterFields = ["gameown", "gameprevowned", "gamewanttobuy"];
      if (!filterFields.includes(params.f)) {
        throw new Error("Invalid filter field!");
      }

      // Sorting
      const sortFields = ["id", "title", "yearpublished"];
      if (!sortFields.includes(params.s)) {
        throw new Error("Invalid sort field!");
      }

      const filter = params.f;
      const gameId: string | null = params.i ? String(params.i) : null;
      const limit = params.l ?? 50;
      const sort = params.s;

      let startIndex = 0;
      let listOfGameIds: { id: string }[] = [];
      if (gameId) {
        listOfGameIds = await getListOfGameIds(filter, sort);
        if (listOfGameIds) {
          startIndex =
            listOfGameIds.findIndex((game) => game.id === gameId) ?? 0;
        }
      }

      const gameList: DbReturnedGame[] = await findGames(
        filter,
        startIndex,
        limit,
        sort,
      );
      // Need to gather the varous cursors we will be returning
      let firstCursor: string | null = null;
      let prevCursor: string | null = null;
      let nextCursor: string | null = null;
      let lastCursor: string | null = null;

      // The first "page"
      if (startIndex >= limit * 2) {
        firstCursor = getEncodedCursor(null, params.l, params.s, params.f);
      }

      // The previous "page"
      if (
        startIndex >= limit &&
        listOfGameIds &&
        listOfGameIds[startIndex - limit] !== undefined
      ) {
        const prevId = listOfGameIds[startIndex - limit];
        if (prevId === undefined) {
          throw new Error("No such game. Cannot build a previous page cursor!");
        } else {
          prevCursor = getEncodedCursor(
            prevId.id,
            params.l,
            params.s,
            params.f,
          );
        }
      }

      // The next "page"
      if (startIndex <= listOfGameIds.length - limit - 1) {
        const nextId = listOfGameIds[startIndex + limit];
        if (nextId === undefined) {
          throw new Error("No such game. Cannot build a next page cursor!");
        } else {
          nextCursor = getEncodedCursor(
            nextId.id,
            params.l,
            params.s,
            params.f,
          );
        }
      }

      // The last "page"
      if (startIndex <= listOfGameIds.length - limit * 2 - 1) {
        const lastId = listOfGameIds[listOfGameIds.length - limit];
        if (lastId === undefined) {
          throw new Error("No such game. Cannot build a last page cursor!");
        } else {
          lastCursor = getEncodedCursor(
            lastId.id,
            params.l,
            params.s,
            params.f,
          );
        }
      }

      // Assemble data for each returned game
      const gameNodes = [];
      let gameCursor;
      for (let i = 0; i < gameList.length; i++) {
        if (gameList[i] === undefined) {
          throw new Error("There is no game to add to the returnedGameNode!");
        }
        gameCursor = getEncodedCursor(
          gameList[i]!.id,
          params.l,
          params.s,
          params.f,
        );

        let roleList = [];
        let thisRoleIndex = 0;
        for (const role of gameList[i]?.entities ?? []) {
          if (roleList) {
            thisRoleIndex = roleList.findIndex(
              (existingRole) => existingRole.id === role.role.id,
            );
          }
          if (thisRoleIndex === -1) {
            roleList.push({
              id: role.role.id,
              role: role.role.name,
              entities: [
                {
                  id: role.entity.id,
                  bggid: role.entity.bggid,
                  name: role.entity.name,
                },
              ],
            });
          } else {
            roleList[thisRoleIndex]?.entities?.push({
              id: role.entity.id,
              bggid: role.entity.bggid,
              name: role.entity.name,
            });
          }
        }

        const game = gameList[i] as Game;
        game.entitiesByRole = roleList;

        gameNodes.push({ game: gameList[i], cursor: gameCursor });
      }

      // Assemble the whole payload
      let returnObject: GameConnection = {
        totalCount: listOfGameIds.length,
        gameNumber: startIndex,
        firstCursor: firstCursor,
        prevCursor: prevCursor,
        nextCursor: nextCursor,
        lastCursor: lastCursor,
        games: gameNodes as GameNode[],
      };

      return returnObject;
    },
  },
};
