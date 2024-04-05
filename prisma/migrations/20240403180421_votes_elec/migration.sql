/*
  Warnings:

  - Added the required column `electionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vote` ADD COLUMN `electionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_electionId_fkey` FOREIGN KEY (`electionId`) REFERENCES `Election`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
