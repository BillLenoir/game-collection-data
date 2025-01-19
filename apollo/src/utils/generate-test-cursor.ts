import { getEncodedCursor } from "./get-encoded-cursor.js";

const testCursor = getEncodedCursor(
  "4257",
  20,
  "yearpublished",
  "gameprevowned",
);

console.log(testCursor);
