/*
  Warnings:

  - The primary key for the `EntityGameRelationship` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EntityGameRelationship" (
    "gameid" TEXT NOT NULL,
    "entityid" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    PRIMARY KEY ("entityid", "gameid", "relationship"),
    CONSTRAINT "EntityGameRelationship_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntityGameRelationship_entityid_fkey" FOREIGN KEY ("entityid") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EntityGameRelationship" ("entityid", "gameid", "relationship") SELECT "entityid", "gameid", "relationship" FROM "EntityGameRelationship";
DROP TABLE "EntityGameRelationship";
ALTER TABLE "new_EntityGameRelationship" RENAME TO "EntityGameRelationship";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
