-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "facebookUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'STUDENT',
    "faculty" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Club" ("createdAt", "description", "facebookUrl", "id", "image", "name", "updatedAt") SELECT "createdAt", "description", "facebookUrl", "id", "image", "name", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
