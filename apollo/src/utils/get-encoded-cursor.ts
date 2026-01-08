import { Cursor } from "../data-types.js";

export const getEncodedCursor = (
  cursorId: string | null,
  cursorLimit: number,
  cursorSort: string,
  cursorFilter: string,
) => {
  let rawCursor = "{ ";
  if (cursorId !== null) {
    rawCursor += `"i": ${cursorId}, `;
  }
  rawCursor += `"l": ${cursorLimit}, "s": "${cursorSort}", "f": "${cursorFilter}" } `;
  const typedRawCursor: Cursor = JSON.parse(rawCursor);
  const encodedCursor = btoa(JSON.stringify(typedRawCursor));
  return encodedCursor;
};
