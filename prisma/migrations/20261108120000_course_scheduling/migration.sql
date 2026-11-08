-- CreateTable
CREATE TABLE "CourseRun" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Oslo',
    "cadenceWeeks" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "weekIndex" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseRun_trainerId_courseId_idx" ON "CourseRun"("trainerId", "courseId");

-- CreateIndex
CREATE INDEX "CourseSession_runId_day_idx" ON "CourseSession"("runId", "day");

-- CreateIndex
CREATE INDEX "CourseEnrollment_customerId_dogId_idx" ON "CourseEnrollment"("customerId", "dogId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_runId_dogId_key" ON "CourseEnrollment"("runId", "dogId");

-- AddForeignKey
ALTER TABLE "CourseRun" ADD CONSTRAINT "CourseRun_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_runId_fkey" FOREIGN KEY ("runId") REFERENCES "CourseRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_runId_fkey" FOREIGN KEY ("runId") REFERENCES "CourseRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseRun" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourseSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourseEnrollment" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "CourseRun", "CourseSession", "CourseEnrollment" FROM anon, authenticated;
