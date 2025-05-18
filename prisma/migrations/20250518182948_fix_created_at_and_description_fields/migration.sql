/*
  Warnings:

  - You are about to drop the column `creatadAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `creatadAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `descriptiom` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `creatadAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `creatadAt` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `creatadAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "creatadAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "creatadAt",
DROP COLUMN "descriptiom",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "creatadAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "creatadAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "creatadAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
