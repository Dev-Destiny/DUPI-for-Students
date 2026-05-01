-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifications" JSONB DEFAULT '{}',
ADD COLUMN     "preferences" JSONB DEFAULT '{}';
