import fs from "fs";
import * as steps from "../src/save-bgg-data.service";
import { dataConfigs } from "../src/utils/data.config";
import * as logger from "../src/utils/log-messages";
import { runStepFunction } from "../src/utils/run-step-function";

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;
let spyMkdir: jest.SpiedFunction<typeof fs.promises.mkdir>;
let spyWriteFile: jest.SpiedFunction<typeof fs.promises.writeFile>;

const { dataDirectory, rawResponseFile } = dataConfigs.localData;
const saveBggDataParameters = {
  dataToSave: "Data to save",
  directory: dataDirectory,
  fileName: rawResponseFile,
};

beforeEach(() => {
  spyLogMessage = jest.spyOn(logger, "logMessage");
  spyMkdir = jest.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined);
  spyWriteFile = jest
    .spyOn(fs.promises, "writeFile")
    .mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("saveData", () => {
  describe("When writeFile throws an error", () => {
    it("Returns OK false", async () => {
      spyWriteFile.mockRejectedValueOnce(
        new Error("ERROR - no space left on device"),
      );

      const testResponse = await runStepFunction(
        "test throw Error writeFile",
        steps.saveBggData,
        saveBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyWriteFile).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test throw Error writeFile failed: ERROR - no space left on device",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });

  describe("When mkdir throws an error", () => {
    it("Returns OK false", async () => {
      spyMkdir.mockRejectedValueOnce(
        new Error("ERROR - Do not have write permission"),
      );

      const testResponse = await runStepFunction(
        "test throw Error mkdir",
        steps.saveBggData,
        saveBggDataParameters,
      );

      expect(testResponse).toBeFalsy();
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyMkdir).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "ERROR",
        "test throw Error mkdir failed: ERROR - Do not have write permission",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "HAPPY",
        expect.any(String),
      );
    });
  });

  describe("When writeFile successfully writes a file", () => {
    it("Returns OK true", async () => {
      const testResponse = await runStepFunction(
        "test save data",
        steps.saveBggData,
        saveBggDataParameters,
      );

      const expectedResponseFromRunStepFunction = "No data to report";

      expect(testResponse).toBe(expectedResponseFromRunStepFunction);
      expect(spyLogMessage).toHaveBeenCalledTimes(1);
      expect(spyLogMessage).toHaveBeenCalledWith(
        "HAPPY",
        "test save data succeeded: Successfully saved the BGG data!",
      );
      expect(spyLogMessage).not.toHaveBeenCalledWith(
        "ERROR",
        expect.any(String),
      );
    });
  });
});
