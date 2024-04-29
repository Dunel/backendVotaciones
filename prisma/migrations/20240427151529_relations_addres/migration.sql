/*
  Warnings:

  - You are about to drop the column `estado` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `municipio` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `parroquia` on the `user` table. All the data in the column will be lost.
  - Added the required column `estadoId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipioId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parroquiaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `estado`,
    DROP COLUMN `municipio`,
    DROP COLUMN `parroquia`,
    ADD COLUMN `estadoId` INTEGER NOT NULL,
    ADD COLUMN `municipioId` INTEGER NOT NULL,
    ADD COLUMN `parroquiaId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_municipioId_fkey` FOREIGN KEY (`municipioId`) REFERENCES `Municipio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_parroquiaId_fkey` FOREIGN KEY (`parroquiaId`) REFERENCES `Parroquia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
