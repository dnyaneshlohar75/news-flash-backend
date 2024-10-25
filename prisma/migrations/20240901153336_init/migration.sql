-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "contactNumber" INTEGER,
    "password" TEXT NOT NULL,
    "profileUrl" TEXT,
    "isAuthor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "article" (
    "articleId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "author" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "urlToImage" TEXT NOT NULL,
    "content" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "comments" (
    "commentId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_emailId_key" ON "users"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "article_articleId_key" ON "article"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "comments_commentId_key" ON "comments"("commentId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("articleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("articleId") ON DELETE CASCADE ON UPDATE CASCADE;
