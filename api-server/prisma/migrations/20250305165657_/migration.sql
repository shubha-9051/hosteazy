/*
  Warnings:

  - The values [FAILED] on the enum `DeployementStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `projectId` on the `Deployement` table. All the data in the column will be lost.
  - You are about to drop the column `customDomain` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `gitUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `subDomain` on the `Project` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `Deployement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `git_url` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdomain` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeployementStatus_new" AS ENUM ('NOT_STARTED', 'QUEUED', 'IN_PROGRESS', 'READY', 'FAIL');
ALTER TABLE "Deployement" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Deployement" ALTER COLUMN "status" TYPE "DeployementStatus_new" USING ("status"::text::"DeployementStatus_new");
ALTER TYPE "DeployementStatus" RENAME TO "DeployementStatus_old";
ALTER TYPE "DeployementStatus_new" RENAME TO "DeployementStatus";
DROP TYPE "DeployementStatus_old";
ALTER TABLE "Deployement" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Deployement" DROP CONSTRAINT "Deployement_projectId_fkey";

-- AlterTable
ALTER TABLE "Deployement" DROP COLUMN "projectId",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "customDomain",
DROP COLUMN "gitUrl",
DROP COLUMN "subDomain",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "custom_domain" TEXT,
ADD COLUMN     "git_url" TEXT NOT NULL,
ADD COLUMN     "subdomain" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Deployement" ADD CONSTRAINT "Deployement_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
