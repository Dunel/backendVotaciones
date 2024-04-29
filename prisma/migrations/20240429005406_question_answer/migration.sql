/*
  Warnings:

  - You are about to drop the column `quest1` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `quest2` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `quest3` on the `user` table. All the data in the column will be lost.
  - Added the required column `answer` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `quest1`,
    DROP COLUMN `quest2`,
    DROP COLUMN `quest3`,
    ADD COLUMN `answer` VARCHAR(191) NOT NULL,
    ADD COLUMN `question` VARCHAR(191) NOT NULL;
