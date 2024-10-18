const mockFetch = jest.fn();

import {
  fetchBggTryAgainResponse,
  fetchTryFailedResponse,
  validGameXML,
} from "./test.data";
import { DataResponse } from "../src/utils/data.types";
import { fetchData } from "../src/utils/fetch-data";

global.fetch = mockFetch;

afterEach(async () => {
  jest.resetAllMocks();
});

describe("fetchData", () => {
  describe("When the try of fetch fails", () => {
    it("Returns a fail", async () => {
      mockFetch.mockRejectedValue(fetchTryFailedResponse);

      const testResponse: DataResponse = await fetchData(
        "collection",
        "billlenoir",
      );

      expect(testResponse.successOrFailure).toEqual("FAIL");
      expect(
        testResponse.message.startsWith("An error occurred during the fetch"),
      ).toBe(true);
    });
  });
  describe("When the response includes 'Your request for this collection has been accepted and will be processed'", () => {
    it("Returns a fail", async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        text: async () =>
          Promise.resolve(JSON.stringify(fetchBggTryAgainResponse)),
      });

      const testResponse: DataResponse = await fetchData(
        "collection",
        "billlenoir",
      );

      expect(testResponse.successOrFailure).toEqual("FAIL");
    });
  });
  describe("When the rawResponse is empty", () => {
    it("Returns a fail", async () => {
      mockFetch.mockResolvedValue("");

      const testResponse: DataResponse = await fetchData(
        "collection",
        "billlenoir",
      );

      expect(testResponse.successOrFailure).toEqual("FAIL");
    });
  });
  describe("When the fetch succeeds", () => {
    it("Returns a success", async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        text: async () => Promise.resolve(JSON.stringify(validGameXML)),
      });

      const testResponse: DataResponse = await fetchData(
        "collection",
        "billlenoir",
      );

      expect(testResponse.successOrFailure).toEqual("SUCCESS");
    });
  });
});
