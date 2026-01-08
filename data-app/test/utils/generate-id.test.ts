import { idGenerator } from "../../src/utils/generate-id";

describe("IdGenerator", () => {
  it("Returns 1 when called the first time", () => {
    const firstCallForId = idGenerator.generateId();
    expect(firstCallForId).toBe("1");
  });

  it("Returns 2 when called a second time", () => {
    const secondCallForId = idGenerator.generateId();
    expect(secondCallForId).toBe("2");
  });
});
