import fs from "fs";
import { dataConfigs } from "../../src/utils/data.config";
import * as logger from "../../src/utils/log-messages";
import { runStepFunction } from "../../src/utils/run-step-function";
import * as steps from "../../src/utils/save-bgg-data";

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;
let spyMkdir: jest.SpiedFunction<typeof fs.promises.mkdir>;
let spyWriteFile: jest.SpiedFunction<typeof fs.promises.writeFile>;

const { dataDirectory } = dataConfigs.localData;
const saveBggDataParameters = {
  dataToSave: "Data to save",
  directory: dataDirectory,
  fileName: "game-game-1.xml",
};

beforeEach(() => {
  jest.restoreAllMocks();
  spyLogMessage = jest.spyOn(logger, "logMessage");
  spyMkdir = jest.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined);
  spyWriteFile = jest
    .spyOn(fs.promises, "writeFile")
    .mockResolvedValue(undefined);
});

describe("saveBggData", () => {
  it("Returns OK false when writeFile throws an error", async () => {
    spyWriteFile.mockRejectedValueOnce(
      new Error("ERROR - no space left on device"),
    );

    const saveBggDataResponse = await runStepFunction(
      "test throw Error writeFile",
      steps.saveBggData,
      saveBggDataParameters,
    );

    expect(saveBggDataResponse.ok).toBe(false);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyWriteFile).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "test throw Error writeFile failed: saveBggData threw for: game-game-1.xml - ERROR - no space left on device",
    );
  });

  it("Returns OK false when mkdir throws an error", async () => {
    spyMkdir.mockRejectedValueOnce(
      new Error("ERROR - Do not have write permission"),
    );

    const saveBggDataResponse = await runStepFunction(
      "test throw Error mkdir",
      steps.saveBggData,
      saveBggDataParameters,
    );

    expect(saveBggDataResponse.ok).toBe(false);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyMkdir).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "test throw Error mkdir failed: saveBggData threw for: game-game-1.xml - ERROR - Do not have write permission",
    );
  });

  it("Returns OK true when writeFile successfully writes a file", async () => {
    const saveBggDataResponse = await runStepFunction(
      "test save data",
      steps.saveBggData,
      saveBggDataParameters,
    );

    const expectedResponseFromRunStepFunction = "No data to report";

    // Need this to type narrow saveBggDataResponse to the good version
    if (!saveBggDataResponse.ok) {
      throw new Error(
        `Expect OK to be true, but got false: ${saveBggDataResponse.message}`,
      );
    }
    expect(saveBggDataResponse.data).toBe(expectedResponseFromRunStepFunction);
    expect(spyLogMessage).not.toHaveBeenCalled();
  });
});
