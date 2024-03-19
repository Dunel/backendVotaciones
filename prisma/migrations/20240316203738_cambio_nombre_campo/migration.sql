/*
  Warnings:

  - You are about to drop the column `cedulaIdentidad` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropIndex
DROP INDEX `User_cedulaIdentidad_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cedulaIdentidad`,
    ADD COLUMN `cedula` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `post`;

-- CreateIndex
CREATE UNIQUE INDEX `User_cedula_key` ON `User`(`cedula`);
