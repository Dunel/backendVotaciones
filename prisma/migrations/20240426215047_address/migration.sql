/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - Added the required column `municip` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parroquia` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    ADD COLUMN `municip` VARCHAR(191) NOT NULL,
    ADD COLUMN `parroquia` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;
