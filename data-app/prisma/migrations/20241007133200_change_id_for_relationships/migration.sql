/*
  Warnings:

  - You are about to drop the `EntityGameRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EntityGameRelationship";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EntityGameRoleRelationship" (
    "gameid" TEXT NOT NULL,
    "entityid" TEXT NOT NULL,
    "roleid" TEXT NOT NULL,

    PRIMARY KEY ("entityid", "gameid", "roleid"),
    CONSTRAINT "EntityGameRoleRelationship_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntityGameRoleRelationship_entityid_fkey" FOREIGN KEY ("entityid") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntityGameRoleRelationship_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
