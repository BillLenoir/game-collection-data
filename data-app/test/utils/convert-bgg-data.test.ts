import convert from "xml-js";
import * as steps from "../../src/utils/convert-bgg-data";
import * as logger from "../../src/utils/log-messages";
import { runStepFunction } from "../../src/utils/run-step-function";

const convertBggDataInput = {
  xml: "fetchBggDataResponse",
  options: { compact: true, spaces: 2 },
};

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;
let spyXml2json: jest.SpiedFunction<typeof convert.xml2json>;

beforeEach(() => {
  jest.restoreAllMocks();
  spyLogMessage = jest.spyOn(logger, "logMessage");
  spyXml2json = jest.spyOn(convert, "xml2json");
});

describe("convertBggData", () => {
  it("Returns OK false when convert.xml2json throws an error", async () => {
    spyXml2json.mockImplementation(() => {
      throw new Error("ERROR - Invalid XML");
    });

    const convertBggDataResponse = await runStepFunction(
      "test throw Error convert.xml2json",
      steps.convertBggData,
      convertBggDataInput,
    );

    expect(convertBggDataResponse.ok).toBe(false);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyXml2json).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "test throw Error convert.xml2json failed: ERROR - Invalid XML",
    );
  });

  it("Returns OK true when convert.xml2json successfully converts the BGG data", async () => {
    spyXml2json.mockReturnValue(JSON.stringify({ field1: "asdf" }));

    const convertBggDataResponse = await runStepFunction(
      "test successful convert.xml2json",
      steps.convertBggData,
      convertBggDataInput,
    );

    const expectedResponseFromRunStepFunction = { field1: "asdf" };

    // Need this to type narrow convertBggDataResponse to the good version
    if (!convertBggDataResponse.ok) {
      throw new Error(
        `Expect OK to be true, but got false: ${convertBggDataResponse.message}`,
      );
    }
    expect(convertBggDataResponse.data).toStrictEqual(
      expectedResponseFromRunStepFunction,
    );
    expect(spyXml2json).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).not.toHaveBeenCalled();
  });
});
