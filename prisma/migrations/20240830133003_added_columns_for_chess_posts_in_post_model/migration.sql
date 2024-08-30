-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "boardFen" TEXT,
ADD COLUMN     "boardSolution" TEXT,
ADD COLUMN     "gamePGN" TEXT,
ADD COLUMN     "postType" TEXT NOT NULL DEFAULT 'regular';
