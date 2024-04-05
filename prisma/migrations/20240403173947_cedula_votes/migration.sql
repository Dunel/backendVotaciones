/*
  Warnings:

  - You are about to alter the column `cedula` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `userId` on the `vote` table. All the data in the column will be lost.
  - Added the required column `userCedula` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_userId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `cedula` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vote` DROP COLUMN `userId`,
    ADD COLUMN `userCedula` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `user_id_index` ON `Vote`(`userCedula`);

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_userCedula_fkey` FOREIGN KEY (`userCedula`) REFERENCES `User`(`cedula`) ON DELETE RESTRICT ON UPDATE CASCADE;
