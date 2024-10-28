const mockGetGameData = jest.fn();

import {
  validExistingEntity,
  validBggGameJsonWithoutEntities,
  validBggGameDataFromCollection,
  getGameDataFailFormatCollectionDataResponse,
  validBggGameJson,
  getGameDataTryFailFormatCollectionDataResponse,
  getGameDataGameSuccessResponse,
  validGameData,
  promiseAllFulfilledResponse,
  validCollectionXMLTwoGames,
} from "./test.data";
import {
  extractAndProcessEntities,
  formatCollectionData,
  processGame,
  processRoles,
} from "../src/format-collection-data";

jest.mock("../src/get-game-data.ts", () => ({
  getGameData: mockGetGameData,
}));

afterEach(async () => {
  jest.resetAllMocks();
});

describe("extractAndProcessEntities", () => {
  describe("When processing a game with 1 or more entities", () => {
    it("the returned value is an array with a length of 1 or more", () => {
      const testExtractAndProcessEntities =
        extractAndProcessEntities(validBggGameJson);
      expect(testExtractAndProcessEntities.length).toEqual(16);
    });
  });
  describe("When processing a game with no entities", () => {
    it("the returned value is an array with a length of 0", () => {
      const testExtractAndProcessEntities = extractAndProcessEntities(
        validBggGameJsonWithoutEntities,
      );
      expect(testExtractAndProcessEntities.length).toEqual(0);
    });
  });
});

describe("processRoles", () => {
  describe("When passed an entity", () => {
    it("returns a role", () => {
      const testProcessRoles = processRoles(validExistingEntity.role);
      expect(testProcessRoles.name).toEqual(validExistingEntity.role);
    });
  });
});

describe("processGame", () => {
  describe("When getGameData returns empty", () => {
    it("processGame returns FAIL", async () => {
      mockGetGameData.mockResolvedValue("");
      const testProcessGame = await processGame(validBggGameDataFromCollection);
      expect(testProcessGame).toEqual(
        getGameDataFailFormatCollectionDataResponse,
      );
    });
  });

  describe("When getGameData returns FAIL", () => {
    it("processGame  returns FAIL", async () => {
      mockGetGameData.mockResolvedValue(
        getGameDataFailFormatCollectionDataResponse,
      );
      const testProcessGame = await processGame(validBggGameDataFromCollection);
      expect(testProcessGame).toEqual(
        getGameDataFailFormatCollectionDataResponse,
      );
    });
  });

  describe("When the try of getGameData fails", () => {
    it("processGame  returns FAIL", async () => {
      mockGetGameData.mockRejectedValue("getGameData Failed");
      const testProcessGame = await processGame(validBggGameDataFromCollection);
      expect(testProcessGame).toEqual(
        getGameDataTryFailFormatCollectionDataResponse,
      );
    });
  });

  describe("When provided valid BggGameDataFromCollection", () => {
    it("processGame returns valid GameData", async () => {
      mockGetGameData.mockResolvedValue(getGameDataGameSuccessResponse);
      const testProcessGame = await processGame(validBggGameDataFromCollection);
      expect(testProcessGame.successOrFailure).toEqual("SUCCESS");
      const receivedData = JSON.parse(testProcessGame.data);
      expect(receivedData.bggId).toEqual(validGameData.bggId);
    });
  });
});

const mockPromiseAllSettled = jest.spyOn(Promise, "allSettled");

describe("formatCollectionData", () => {
  describe("When provided valid rawCollectionData", () => {
    it("formatCollectionData returns SUCCESS", async () => {
      mockPromiseAllSettled.mockResolvedValueOnce([
        promiseAllFulfilledResponse,
      ]);
      const testFormationCollectionData = await formatCollectionData(
        validCollectionXMLTwoGames,
      );
      expect(testFormationCollectionData.successOrFailure).toEqual("SUCCESS");
      expect(testFormationCollectionData.message).toEqual(
        "Formatted collection data successfully",
      );
    });
  });
});
