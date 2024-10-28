import fs from "fs/promises";
import { writeToFile } from "../src/utils/write-to-file";

const mockWriteFile = jest.spyOn(fs, "writeFile");
const spyLogMessage = jest.spyOn(console, "log");

describe("writeToFile", () => {
  describe("When passed a valid path and data to write", () => {
    it("Logs a HAPPY message", async () => {
      mockWriteFile.mockResolvedValueOnce(undefined);
      const testWrite = await writeToFile("Path", "data");
      expect(testWrite).not.toBeDefined();
      expect(spyLogMessage).toHaveBeenCalledWith(
        "\x1b[32m%s\x1b[0m",
        "File written: Path",
      );
    });
  });

  describe("When the write to file fails", () => {
    it("Throws an error", async () => {
      mockWriteFile.mockRejectedValue("Write failed");
      await expect(writeToFile("Path", "data")).rejects.toThrow(
        "Failed to write file Path TRY FAILURE MESSAGE: Write failed",
      );
    });
  });
});
