-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "postPicture" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/do1rucyzl/image/upload/v1769052594/placeholder-image_x8y4ld.png';
