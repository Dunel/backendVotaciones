/*
  Warnings:

  - You are about to drop the column `municip` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user` table. All the data in the column will be lost.
  - Added the required column `estado` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `municip`,
    DROP COLUMN `state`,
    ADD COLUMN `estado` VARCHAR(191) NOT NULL,
    ADD COLUMN `municipio` VARCHAR(191) NOT NULL;
