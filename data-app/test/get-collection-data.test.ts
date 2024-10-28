const mockFetchData = jest.fn();

import {
  getGameDataCollectionSuccessResponse,
  getGameDataFailGetCollectionDataResponse,
} from "./test.data";
import { getCollectionData } from "../src/get-collection-data";

jest.mock("../src/utils/fetch-data.ts", () => ({
  fetchData: mockFetchData,
}));

afterEach(async () => {
  jest.resetAllMocks();
});

describe("getCollectionData", () => {
  describe("When retrieving collection data for a valid BGG user", () => {
    it("Returns a response with the XML from BGG", async () => {
      mockFetchData.mockResolvedValue(getGameDataCollectionSuccessResponse);
      const testResult = await getCollectionData("ValidUserName");
      expect(testResult.successOrFailure).toEqual("SUCCESS");
    });
  });

  describe("When getCollectionData returns empty", () => {
    it("gameResponse returns FAIL", async () => {
      mockFetchData.mockResolvedValue("");
      const testProcessGame = await getCollectionData("ValidUserName");
      expect(testProcessGame.successOrFailure).toEqual("FAIL");
    });
  });

  describe("When getCollectionData returns FAIL", () => {
    it("gameResponse  returns FAIL", async () => {
      mockFetchData.mockResolvedValue(getGameDataFailGetCollectionDataResponse);
      const testProcessGame = await getCollectionData("ValidUserName");
      expect(testProcessGame.successOrFailure).toEqual("FAIL");
    });
  });

  describe("When the try of getCollectionData fails", () => {
    it("gameResponse returns FAIL", async () => {
      mockFetchData.mockRejectedValue("getGameData Failed");
      await expect(getCollectionData("ValidUserName")).rejects.toThrow(
        "getCollectionData > fetchData TRY FAILURE MESSAGE: getGameData Failed",
      );
    });
  });
});
