/*
  Warnings:

  - You are about to drop the column `name` on the `Shipper` table. All the data in the column will be lost.
  - Added the required column `contactPerson` to the `Shipper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipper" DROP COLUMN "name",
ADD COLUMN     "contactPerson" TEXT NOT NULL;
