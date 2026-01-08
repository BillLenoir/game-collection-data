import { logWithColor } from "../src/utils/log-messages"; // Import the actual function

jest.mock("../src/utils/log-messages", () => ({
  logWithColor: jest.fn(), // Mocking logWithColor
}));

describe("logWithColor", () => {
  describe("When try of console.log fails", () => {
    it("Throws an error", () => {
      const mockLogWithColor = logWithColor as jest.MockedFunction<
        typeof logWithColor
      >;

      // Mock the function to throw an error
      mockLogWithColor.mockImplementation(() => {
        throw new Error("Failed to log");
      });

      // Test that the error is thrown
      expect(() => {
        logWithColor("\x1b[31m%s\x1b[0m", "This is an error message");
      }).toThrow("Failed to log");
    });
  });
});
