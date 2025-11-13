import { entityProcessor } from "../src/process-entities.service";
import type { EntityData, ExtractedEntity } from "../src/utils/data.types";

describe("processExtractedEntities", () => {
  const testEntityProcess = entityProcessor;
  const extractedEntity1: ExtractedEntity = {
    bggId: "222",
    name: "Test Entity 1",
    role: "Designer",
  };
  const processedEntity1: EntityData = {
    id: "1",
    bggId: "222",
    name: "Test Entity 1",
  };
  const extractedEntity2: ExtractedEntity = {
    bggId: "444",
    name: "Test Entity 2",
    role: "Map Artist",
  };
  const processedEntity2: EntityData = {
    id: "2",
    bggId: "444",
    name: "Test Entity 2",
  };

  it("returns a list of processed entities when passed a valid entity", () => {
    testEntityProcess.processExtractedEntities([extractedEntity1]);
    const firstListOfProcessedEneities =
      testEntityProcess.listOfProcessedEntities;
    expect(firstListOfProcessedEneities.length).toBe(1);
    expect(firstListOfProcessedEneities[0]).toStrictEqual(processedEntity1);
  });

  it("Expands the list when passed a new valid entity to process", () => {
    testEntityProcess.processExtractedEntities([extractedEntity2]);
    const secondListOfProcessedEneities =
      testEntityProcess.listOfProcessedEntities;
    expect(secondListOfProcessedEneities.length).toBe(2);
    expect(secondListOfProcessedEneities[1]).toStrictEqual(processedEntity2);
  });

  it("Does NOT expand the list when passed an already process entity", () => {
    testEntityProcess.processExtractedEntities([extractedEntity2]);
    const thirdListOfProcessedEneities =
      testEntityProcess.listOfProcessedEntities;
    expect(thirdListOfProcessedEneities.length).toBe(2);
  });
});
