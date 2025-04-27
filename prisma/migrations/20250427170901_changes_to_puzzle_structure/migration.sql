/*
  Warnings:

  - Added the required column `difficulty` to the `DailyPuzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hint` to the `DailyPuzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mateInN` to the `DailyPuzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `DailyPuzzle` table without a default value. This is not possible if the table is not empty.
  - Made the column `solution` on table `DailyPuzzle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailyPuzzle" ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "hint" TEXT NOT NULL,
ADD COLUMN     "mateInN" INTEGER NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL,
ALTER COLUMN "solution" SET NOT NULL;
