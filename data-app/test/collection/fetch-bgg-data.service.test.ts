import * as steps from "../../src/collection/fetch-bgg-collection-data.service";
import * as fetcher from "../../src/utils/bgg-api-client";
import * as logger from "../../src/utils/log-messages";
import { runStepFunction } from "../../src/utils/run-step-function";

const mockFetch = jest.fn();
global.fetch = mockFetch;

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;
let spyCallToCallTheActualFetchCall: jest.SpiedFunction<
  typeof steps.fetchCollectionDataFromBgg
>;
let spyActualFetchCall: jest.SpiedFunction<typeof fetcher.bggApiClient>;

const testFetchBggDataParameters = {
  path: "collection",
  parameters: "billlenoir",
};

beforeEach(() => {
  spyLogMessage = jest.spyOn(logger, "logMessage");
  spyCallToCallTheActualFetchCall = jest.spyOn(
    steps,
    "fetchCollectionDataFromBgg",
  );
  spyActualFetchCall = jest.spyOn(fetcher, "callBggApi");
});

afterEach(() => {
  jest.restoreAllMocks();
  mockFetch.mockReset();
});

describe("fetchDataFromBgg", () => {
  describe("When the fetch returns not OK", () => {
    it("Returns OK false", async () => {
      mockFetch.mockResolvedValue(
        new Response("Service Unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        }),
      );

      const testResponse = await runStepFunction(
        "test not OK fetch",
        steps.fetchCollectionDataFromBgg,
        testFetchBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyCallToCallTheActualFetchCall).toHaveBeenCalledTimes(1);
      await expect(
        spyCallToCallTheActualFetchCall.mock.results[0].value,
      ).resolves.toEqual(expect.objectContaining({ ok: false }));
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test not OK fetch failed: BGG returned NOT ok: Service Unavailable",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });

  describe("When the response includes 'Your request for this collection has been accepted and will be processed'", () => {
    it("Returns OK false", async () => {
      mockFetch
        .mockResolvedValueOnce(
          new Response(
            "Your request for this collection has been accepted and will be processed",
            {
              status: 200,
              headers: { "Content-Type": "text/plain" },
            },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            "Your request for this collection has been accepted and will be processed",
            {
              status: 200,
              headers: { "Content-Type": "text/plain" },
            },
          ),
        );

      const testResponse = await runStepFunction(
        "test retry fetch",
        steps.fetchCollectionDataFromBgg,
        testFetchBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyCallToCallTheActualFetchCall).toHaveBeenCalledTimes(1);
      expect(spyActualFetchCall).toHaveBeenCalledTimes(2);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test retry fetch failed: BGG said to try again",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    }, 10500);
  });

  describe("When the fetch data includes items", () => {
    it("Returns OK true", async () => {
      mockFetch.mockResolvedValue(
        new Response("asdf <item> asdf", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }),
      );

      const testResponse = await runStepFunction(
        "test successful fetch",
        steps.fetchCollectionDataFromBgg,
        testFetchBggDataParameters,
      );

      const expectedResponseFromRunStepFunction = "asdf <item> asdf";
      const expectedResponseFromFetchDataFromBgg = {
        data: "asdf <item> asdf",
        message: "Received a response from BGG!",
        ok: true,
      };

      expect(testResponse).toBe(expectedResponseFromRunStepFunction);
      expect(spyCallToCallTheActualFetchCall).toHaveBeenCalledTimes(1);
      await expect(
        spyCallToCallTheActualFetchCall.mock.results[0].value,
      ).resolves.toEqual(expectedResponseFromFetchDataFromBgg);
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "HAPPY",
        "test successful fetch succeeded: Received a response from BGG!",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "ERROR",
        expect.any(String),
      );
    });
  });

  describe("When the fetch data does NOT include any items", () => {
    it("Returns OK false", async () => {
      mockFetch.mockResolvedValue(
        new Response("asdf <it em> asdf", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }),
      );

      const testResponse = await runStepFunction(
        "test unexpect response fetch",
        steps.fetchCollectionDataFromBgg,
        testFetchBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyCallToCallTheActualFetchCall).toHaveBeenCalledTimes(1);
      await expect(
        spyCallToCallTheActualFetchCall.mock.results[0].value,
      ).resolves.toEqual(expect.objectContaining({ ok: false }));
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test unexpect response fetch failed: Received unexpected response from BGG: asdf <it em> asdf",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });

  describe("When the try of fetch throws an error", () => {
    it("Returns OK false", async () => {
      mockFetch.mockRejectedValue(new Error("Fetch Failed"));

      const testResponse = await runStepFunction(
        "test throw Error fetch",
        steps.fetchCollectionDataFromBgg,
        testFetchBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyCallToCallTheActualFetchCall).toHaveBeenCalledTimes(1);
      await expect(
        spyCallToCallTheActualFetchCall.mock.results[0].value,
      ).resolves.toEqual(expect.objectContaining({ ok: false }));
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test throw Error fetch failed: Fetch Failed",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });
});
