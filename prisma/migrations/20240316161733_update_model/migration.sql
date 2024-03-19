/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedulaIdentidad]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cedulaIdentidad` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    DROP COLUMN `username`,
    ADD COLUMN `apellido` VARCHAR(191) NOT NULL,
    ADD COLUMN `cedulaIdentidad` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cedulaIdentidad_key` ON `User`(`cedulaIdentidad`);
