/*
  Warnings:

  - Added the required column `contactPerson` to the `Carrier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Carrier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Carrier" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPerson" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL;
