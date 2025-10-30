import convert from "xml-js";
import * as steps from "../src/convert-bgg-data.service";
import * as logger from "../src/utils/log-messages";
import { runStepFunction } from "../src/utils/run-step-function";

const convertBggDataInput = {
  xml: "fetchBggDataResponse",
  options: { compact: true, spaces: 2 },
};

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;
let spyXml2json: jest.SpiedFunction<typeof convert.xml2json>;

beforeEach(() => {
  spyLogMessage = jest.spyOn(logger, "logMessage");
  spyXml2json = jest.spyOn(convert, "xml2json");
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("convertBggData", () => {
  describe("When convert.xml2json throws an error", () => {
    it("Returns OK false", async () => {
      spyXml2json.mockImplementation(() => {
        throw new Error("ERROR - Invalid XML");
      });

      const testResponse = await runStepFunction(
        "test throw Error convert.xml2json",
        steps.convertBggData,
        convertBggDataInput,
      );

      expect(testResponse).toBeFalsy();
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyXml2json).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test throw Error convert.xml2json failed: ERROR - Invalid XML",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });

  describe("When convert.xml2json successfully converts the BGG data", () => {
    it("Returns OK true", async () => {
      spyXml2json.mockReturnValue("Successfully converted the BGG data!");

      const testResponse = await runStepFunction(
        "test successful convert.xml2json",
        steps.convertBggData,
        convertBggDataInput,
      );

      const expectedResponseFromRunStepFunction =
        "Successfully converted the BGG data!";

      expect(testResponse).toBe(expectedResponseFromRunStepFunction);
      expect(spyXml2json).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "HAPPY",
        "test successful convert.xml2json succeeded: Successfully converted the BGG data!",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "ERROR",
        expect.any(String),
      );
    });
  });
});
