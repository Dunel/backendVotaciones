/*
  Warnings:

  - You are about to drop the column `apellido` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `user` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `apellido`,
    DROP COLUMN `nombre`,
    ADD COLUMN `fullname` VARCHAR(191) NOT NULL;
