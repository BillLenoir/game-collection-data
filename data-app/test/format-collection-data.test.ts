import {
  validExistingEntity,
  validGameJson,
  validGameJsonWithoutEntities,
} from "./test.data";
import {
  extractAndProcessEntities,
  processRoles,
} from "../src/format-collection-data";

describe("extractAndProcessEntities", () => {
  describe("When processing a game with 1 or more entities", () => {
    it("the returned value is an array with a length of 1 or more", () => {
      const testExtractAndProcessEntities =
        extractAndProcessEntities(validGameJson);
      expect(testExtractAndProcessEntities.length).toEqual(16);
    });
  });
  describe("When processing a game with no entities", () => {
    it("the returned value is an array with a length of 0", () => {
      const testExtractAndProcessEntities = extractAndProcessEntities(
        validGameJsonWithoutEntities,
      );
      expect(testExtractAndProcessEntities.length).toEqual(0);
    });
  });
});

describe("processRoles", () => {
  describe("When passed an entity", () => {
    it("returns a role", () => {
      const testProcessRoles = processRoles(validExistingEntity.role);
      expect(testProcessRoles.name).toEqual(validExistingEntity.role);
    });
  });
});

describe("processGame", () => {
  describe("When passed a game")
});
