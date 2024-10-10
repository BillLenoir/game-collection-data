const mockFetchData = jest.fn();

import { PrismaClient } from "@prisma/client";
import { generateCollectionData } from "../src";
import { validCollectionXML, validGameXML } from "./test.data";
import { dataConfigs } from "../src/utils/data.config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

jest.mock("../src/utils/fetch-data.ts", () => ({
  fetchData: mockFetchData,
}));

afterEach(async () => {
  jest.resetAllMocks();
  await prisma.$disconnect();
});

describe("generateCollectionData", () => {
  describe("Given a successful response from BGG with 1 valid game...", () => {
    it("...the database should contain data for the game and related entities.", async () => {
      mockFetchData
        .mockResolvedValueOnce(validCollectionXML)
        .mockResolvedValueOnce(validGameXML);
      await generateCollectionData(dataConfigs.bggUser);
      expect(mockFetchData).toHaveBeenCalledTimes(2);
      const testGetGames = await prisma.game.findMany();
      expect(testGetGames).toEqual("asdf");
    });
  });
});
