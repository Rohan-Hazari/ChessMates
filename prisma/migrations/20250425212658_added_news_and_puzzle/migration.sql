-- CreateTable
CREATE TABLE "Transalation" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,

    CONSTRAINT "Transalation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceLinks" TEXT[],
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPuzzle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "solution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyPuzzle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transalation" ADD CONSTRAINT "Transalation_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
