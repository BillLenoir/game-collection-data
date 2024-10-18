const mockFetch = jest.fn();

import { validGameXML } from "./test.data";
import { getGameData } from "../src/get-game-data";
import { DataResponse } from "../src/utils/data.types";

global.fetch = mockFetch;

afterEach(async () => {
  jest.resetAllMocks();
});

describe("getGameData", () => {
  describe("When the response is empty", () => {
    it("Returns a fail", async () => {
      mockFetch.mockResolvedValue("");

      const testResponse: DataResponse = await getGameData("collection");

      expect(testResponse.successOrFailure).toEqual("FAIL");
    });
  });

  describe("When the response includes data,", () => {
    it("Returns a success", async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        text: async () => Promise.resolve(JSON.stringify(validGameXML)),
      });

      const testResponse: DataResponse = await getGameData("5");

      expect(testResponse.successOrFailure).toEqual("SUCCESS");
    });
  });
});
