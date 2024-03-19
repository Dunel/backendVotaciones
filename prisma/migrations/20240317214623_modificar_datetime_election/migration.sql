/*
  Warnings:

  - You are about to alter the column `startDate` on the `election` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(2)`.
  - You are about to alter the column `endDate` on the `election` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(2)`.

*/
-- AlterTable
ALTER TABLE `election` MODIFY `startDate` DATETIME(2) NOT NULL,
    MODIFY `endDate` DATETIME(2) NOT NULL;
