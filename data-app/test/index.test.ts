const mockFetch = jest.fn();

import { PrismaClient } from "@prisma/client";
import { generateCollectionData } from "../src";
import { validCollectionXML, validGameXML } from "./test.data";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

global.fetch = mockFetch;

afterEach(async () => {
  jest.resetAllMocks();
  await prisma.$disconnect();
});

describe("generateCollectionData", () => {
  describe("Given a successful response from BGG with 1 valid game...", () => {
    it("...the database should contain data for the game and related entities.", async () => {
      mockFetch
        .mockResolvedValueOnce({
          status: 200,
          text: async () => Promise.resolve(JSON.stringify(validCollectionXML)),
        })
        .mockResolvedValueOnce({
          status: 200,
          text: async () => Promise.resolve(JSON.stringify(validGameXML)),
        });
      await generateCollectionData();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      const testGetGames = await prisma.game.findMany();
      expect(testGetGames).toEqual("asdf");
    });
  });
});
