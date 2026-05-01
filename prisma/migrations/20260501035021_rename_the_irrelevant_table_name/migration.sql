/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "thumbnail",
ADD COLUMN     "postPicture" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/do1rucyzl/image/upload/v1769052594/placeholder-image_x8y4ld.png';
