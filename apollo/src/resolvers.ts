import { games } from "./data/gameOnlyData.js";
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
          startIndex = listOfGameIds.findIndex((game) => game.id === gameId);
        }
      }

      if (startIndex === -1) {
        throw new Error("Game ID not found!");
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

    findGamesJson(_parent, args: { cursor: string }): GameConnection {
      // Parsing the arguments
      const input: Cursor = JSON.parse(atob(args.cursor));

      // Filtering the list of games
      let filteredGames = games.filter(filterCheck(input.f));

      // Sorting the list of games
      // Sort by ID
      if (input.s === "id") {
        filteredGames.sort((a, b) => a.id - b.id);
        // Sort by title
      } else if (input.s === "title") {
        // This sorts the filtered games by title made uppercase.
        filteredGames.sort((a, b) => {
          const gameA = a.title?.toUpperCase() ?? "";
          const gameB = b.title?.toUpperCase() ?? "";
          if (gameA < gameB) {
            return -1;
          }
          if (gameA > gameB) {
            return 1;
          }
          return 0;
        });
        // Sort by year published
      } else if (input.s === "yearpublished") {
        // Sorts the games by year published.
        filteredGames.sort(
          (a, b) => (a.yearpublished ?? 0) - (b.yearpublished ?? 0),
        );
        // Should be one of the previous three sort types
      } else {
        throw new Error("Something wrong with selected sort!");
      }

      // Get the requested number of games, starting at the cursor's location
      let from: number = 0;
      let to: number = 0;
      let cursorGame: Game | null = null;
      let limit: number = input.l;
      // If a game's ID has been included, see if it is in the
      // filtered and sorted list.
      if (input.i !== null) {
        cursorGame = filteredGames.find((game) => game.id === input.i) ?? null;
      }
      // If we found the identified game, we start the returned list at that point
      if (cursorGame !== null) {
        from = filteredGames.indexOf(cursorGame);
      }

      // Check to see how many games remain on the list after the identified game
      // Cannot return more games than remain on the list!
      if (from + limit <= filteredGames.length - 1) {
        to = from + limit;
      } else {
        to = filteredGames.length;
      }

      // Assemble the requested game info
      const returnedGames = filteredGames.slice(from, to);

      // Need to gather the varous cursors we will be returning
      let firstCursor: string | null = null;
      let prevCursor: string | null = null;
      let nextCursor: string | null = null;
      let lastCursor: string | null = null;

      // The first "page"
      if (from >= limit * 2) {
        firstCursor = getEncodedCursor(null, input.l, input.s, input.f);
      }

      // The previous "page"
      if (from >= limit && filteredGames[from - limit] !== undefined) {
        const prevId = filteredGames[from - limit];
        if (prevId === undefined) {
          throw new Error("No such game. Cannot build a previous page cursor!");
        } else {
          prevCursor = getEncodedCursor(prevId.id, input.l, input.s, input.f);
        }
      }

      // The next "page"
      if (from <= filteredGames.length - limit - 1) {
        const nextId = filteredGames[from + limit];
        if (nextId === undefined) {
          throw new Error("No such game. Cannot build a next page cursor!");
        } else {
          nextCursor = getEncodedCursor(nextId.id, input.l, input.s, input.f);
        }
      }

      // The last "page"
      if (from <= filteredGames.length - limit * 2 - 1) {
        const lastId = filteredGames[filteredGames.length - limit];
        if (lastId === undefined) {
          throw new Error("No such game. Cannot build a last page cursor!");
        } else {
          lastCursor = getEncodedCursor(lastId.id, input.l, input.s, input.f);
        }
      }

      // Assemble data for each returned game
      const gameNodes: GameNode[] = [];
      let gameCursor;
      let returnedGameNode: GameNode;
      for (let i = 0; i < returnedGames.length; i++) {
        const returnedGameId = returnedGames[i];
        if (returnedGameId === undefined) {
          throw new Error("No such game. Cannot build a returned game cursor!");
        } else {
          gameCursor = getEncodedCursor(
            returnedGameId.id,
            input.l,
            input.s,
            input.f,
          );
        }
        const thisGame = returnedGames[i];
        if (thisGame === undefined) {
          throw new Error("There is no game to add to the returnedGameNode!");
        } else {
          returnedGameNode = { game: thisGame, cursor: gameCursor };
          gameNodes.push(returnedGameNode);
        }
      }

      // Assemble the whole payload
      let returnObject: GameConnection = {
        totalCount: filteredGames.length,
        gameNumber: from,
        firstCursor: firstCursor,
        prevCursor: prevCursor,
        nextCursor: nextCursor,
        lastCursor: lastCursor,
        games: gameNodes,
      };

      return returnObject;
    },
  },
};
