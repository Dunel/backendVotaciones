-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_candidateId_fkey`;

-- AlterTable
ALTER TABLE `vote` MODIFY `candidateId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
