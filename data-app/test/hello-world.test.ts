import { setTimeout } from "timers/promises";

void setTimeout(1000);

console.log("Hello, world!");

describe("Test of testing", () => {
  it("Passes the test", () => {
    expect(1).toEqual(1);
  });
});
