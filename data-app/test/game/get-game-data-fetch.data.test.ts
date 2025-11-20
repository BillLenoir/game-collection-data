const mockFetchData = jest.fn();

import { DataResponse } from "../../src/utils/data.types";
import { getGameData } from "../src/get-game-data";
import { fetchTryFailedFetchResponse } from "../test.data";

jest.mock("../src/utils/fetch-data.ts", () => ({
  fetchData: mockFetchData,
}));

afterEach(async () => {
  jest.resetAllMocks();
});

describe("getGameData", () => {
  describe("When the try of fetchData fails", () => {
    it("Returns a fail", async () => {
      mockFetchData.mockRejectedValue(fetchTryFailedFetchResponse);

      const testResponse: DataResponse = await getGameData("billlenoir");

      expect(testResponse.successOrFailure).toEqual("FAIL");
      expect(
        testResponse.message.includes("An error occurred during the fetch"),
      ).toBe(true);
    });
  });
});
