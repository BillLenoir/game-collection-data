const mockFetchData = jest.fn();

import { fetchTryFailedResponse } from "./test.data";
import { getGameData } from "../src/get-game-data";
import { DataResponse } from "../src/utils/data.types";

jest.mock("../src/utils/fetch-data.ts", () => ({
  fetchData: mockFetchData,
}));

afterEach(async () => {
  jest.resetAllMocks();
});

describe("getGameData", () => {
  describe("When the try of fetchData fails", () => {
    it("Returns a fail", async () => {
      mockFetchData.mockRejectedValue(fetchTryFailedResponse);

      const testResponse: DataResponse = await getGameData("billlenoir");

      expect(testResponse.successOrFailure).toEqual("FAIL");
      expect(
        testResponse.message.includes("An error occurred during the fetch"),
      ).toBe(true);
    });
  });
});
