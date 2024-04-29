/*
  Warnings:

  - Added the required column `quest1` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quest2` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quest3` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `quest1` VARCHAR(191) NOT NULL,
    ADD COLUMN `quest2` VARCHAR(191) NOT NULL,
    ADD COLUMN `quest3` VARCHAR(191) NOT NULL;
