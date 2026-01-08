-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bggid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "yearpublished" TEXT,
    "thumbnail" TEXT,
    "description" TEXT NOT NULL,
    "gameown" BOOLEAN NOT NULL,
    "gamewanttobuy" BOOLEAN NOT NULL,
    "gameprevowned" BOOLEAN NOT NULL,
    "gamefortrade" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bggid" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EntityGameRelationship" (
    "gameid" INTEGER NOT NULL,
    "entityid" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,

    PRIMARY KEY ("entityid", "gameid"),
    CONSTRAINT "EntityGameRelationship_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntityGameRelationship_entityid_fkey" FOREIGN KEY ("entityid") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_bggid_key" ON "Game"("bggid");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_bggid_key" ON "Entity"("bggid");
