import { logWithColor } from "../src/utils/log-messages"; // Import the actual function

const spyLogMessage = jest.spyOn(console, "log").mockImplementation(() => {});

describe("logWithColor", () => {
  describe("When passed valid parameters", () => {
    it("calls console.log", () => {
      logWithColor(
        "\x1b[31m%s\x1b[0m",
        "This is a message",
        "This is an error message",
      );
      expect(spyLogMessage).toHaveBeenCalledTimes(2);
      expect(spyLogMessage).toHaveBeenNthCalledWith(
        1,
        "\x1b[31m%s\x1b[0m",
        "This is a message",
      );
      expect(spyLogMessage).toHaveBeenNthCalledWith(
        2,
        "\x1b[31m%s\x1b[0m",
        "This is an error message",
      );
    });
  });
});
