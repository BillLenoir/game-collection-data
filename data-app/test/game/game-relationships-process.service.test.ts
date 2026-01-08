import { GameRelationshipProcessor } from "../../src/game/game-relationships-process.service";
import { BggGameDataFromSingleCallJustTheGame } from "../../src/utils/data.types";
import { idGenerator } from "../../src/utils/generate-id";
import * as logger from "../../src/utils/log-messages";
import { runStepFunction } from "../../src/utils/run-step-function";

let processor: GameRelationshipProcessor;
let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;

jest.mock("../../src/utils/generate-id", () => ({
  idGenerator: {
    generateId: jest.fn(() => "mock-id"),
  },
}));

jest.mock("../../src/utils/data.config", () => ({
  dataConfigs: {
    rolesToExtract: {
      designer: true,
      artist: true,
    },
  },
}));

describe("GameRelationshipProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    processor = new GameRelationshipProcessor();
    spyLogMessage = jest.spyOn(logger, "logMessage");
  });

  it("ignores roles not in rolesWeCareAbout", async () => {
    const gameData = {
      _attributes: { objectid: "123" },
      publisher: {
        _attributes: { objectid: "11" },
        _text: "aaa",
      },
      designer: {
        _attributes: { objectid: "12" },
        _text: "bbb",
      },
    };

    await processor.processGameRelationships(gameData);

    const roleNames = processor.listOfRoles.map((role) => role.name);
    const entityNames = processor.listOfEntities.map((entity) => entity.name);

    expect(roleNames).toEqual(["designer"]);
    expect(entityNames).toEqual(["bbb"]);
  });

  it("does not process roles with falsy values", async () => {
    const gameData = {
      _attributes: { objectid: "456" },
      designer: undefined,
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfRoles).toHaveLength(0);
    expect(processor.listOfEntities).toHaveLength(0);
  });

  it("records each role only once even with multiple entities", async () => {
    const gameData = {
      _attributes: { objectid: "789" },
      designer: [
        { _attributes: { objectid: "13" }, _text: "ccc" },
        { _attributes: { objectid: "14" }, _text: "ddd" },
      ],
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfRoles).toHaveLength(1);
    expect(processor.listOfRoles[0].name).toBe("designer");
  });

  it("records multiple distinct roles that we care about", async () => {
    const gameData = {
      _attributes: { objectid: "012" },
      designer: { _attributes: { objectid: "15" }, _text: "eee" },
      artist: { _attributes: { objectid: "16" }, _text: "fff" },
    };

    await processor.processGameRelationships(gameData);

    const roleNames = processor.listOfRoles.map((r) => r.name).sort();
    expect(roleNames).toEqual(["artist", "designer"]);
  });

  it("processes a single entity object correctly", async () => {
    const gameData = {
      _attributes: { objectid: "345" },
      designer: { _attributes: { objectid: "17" }, _text: " eee " },
    };

    await processor.processGameRelationships(gameData);

    expect(idGenerator.generateId).toHaveBeenCalled();
    expect(processor.listOfEntities).toEqual([
      {
        id: "mock-id",
        bggId: "17",
        name: "eee",
      },
    ]);
  });

  it("processes an array of entities correctly", async () => {
    const gameData = {
      _attributes: { objectid: "678" },
      designer: [
        { _attributes: { objectid: "18" }, _text: "ggg" },
        { _attributes: { objectid: "19" }, _text: "hhh" },
      ],
    };

    await processor.processGameRelationships(gameData);

    const names = processor.listOfEntities.map((e) => e.name).sort();
    expect(names).toEqual(["ggg", "hhh"]);
  });

  it("skips entities with empty or whitespace-only names", async () => {
    const gameData = {
      _attributes: { objectid: "901" },
      designer: [
        { _attributes: { objectid: "20" }, _text: "   " }, // ignored
        { _attributes: { objectid: "21" }, _text: "iii" },
      ],
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfEntities).toHaveLength(1);
    expect(processor.listOfEntities[0].name).toBe("iii");
  });

  it("does not create duplicate entities for the same game-role-name combo", async () => {
    const gameData = {
      _attributes: { objectid: "234" },
      designer: [
        { _attributes: { objectid: "22" }, _text: "jjj" },
        { _attributes: { objectid: "23" }, _text: "jjj" },
      ],
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfEntities).toHaveLength(1);
    expect(processor.listOfEntities[0].name).toBe("jjj");
  });

  it("allows same entity name for different roles", async () => {
    const gameData = {
      _attributes: { objectid: "567" },
      designer: { _attributes: { objectid: "24" }, _text: "kkk" },
      artist: { _attributes: { objectid: "25" }, _text: "kkk" },
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfEntities).toHaveLength(2);
    const names = processor.listOfEntities.map((e) => e.name);
    expect(names).toEqual(["kkk", "kkk"]);
  });

  it("clear resets entities, roles, and tracking sets", async () => {
    const gameData = {
      _attributes: { objectid: "890" },
      designer: { _attributes: { objectid: "26" }, _text: "lll" },
    };

    await processor.processGameRelationships(gameData);

    expect(processor.listOfEntities).toHaveLength(1);
    expect(processor.listOfRoles).toHaveLength(1);

    processor.clear();

    expect(processor.listOfEntities).toHaveLength(0);
    expect(processor.listOfRoles).toHaveLength(0);
  });

  it("accumulates entities and roles across multiple calls until cleared", async () => {
    const gameData1 = {
      _attributes: { objectid: "098" },
      designer: { _attributes: { objectid: "27" }, _text: "mmm" },
    };

    const gameData2 = {
      _attributes: { objectid: "765" },
      designer: { _attributes: { objectid: "28" }, _text: "nnn" },
    };

    await processor.processGameRelationships(gameData1);
    await processor.processGameRelationships(gameData2);

    expect(processor.listOfEntities).toHaveLength(2);
    expect(processor.listOfRoles).toHaveLength(1);
    expect(processor.listOfRoles[0].name).toBe("designer");
  });

  it("returns a successful DataResponse with the expected message", async () => {
    const gameData = {
      _attributes: { objectid: "432" },
    };

    const result = await processor.processGameRelationships(gameData);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error(`Expect OK to be true, but got false: ${result.message}`);
    }
    expect(result.data).toBe("No data to return");
    expect(result.message).toBe("Processed relationships for BGG game ID: 432");
  });

  it("does not all logger when runStepFunction is successful", async () => {
    const gameData = {
      _attributes: { objectid: "123" },
      publisher: {
        _attributes: { objectid: "11" },
        _text: "aaa",
      },
      designer: {
        _attributes: { objectid: "12" },
        _text: "bbb",
      },
    };

    const processGameRelationshipsInput: BggGameDataFromSingleCallJustTheGame =
      gameData;
    await runStepFunction<BggGameDataFromSingleCallJustTheGame, string>(
      "Process game relationships",
      processor.processGameRelationships,
      processGameRelationshipsInput,
    );

    expect(spyLogMessage).not.toHaveBeenCalled();
  });
});
