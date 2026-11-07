CREATE TABLE "TrainingEntry" (
  "id" TEXT NOT NULL,
  "dogId" TEXT NOT NULL,
  "day" TEXT NOT NULL,
  "exerciseName" TEXT NOT NULL,
  "category" TEXT,
  "minutes" INTEGER NOT NULL,
  "result" TEXT NOT NULL DEFAULT '',
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrainingEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TrainingEntry_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TrainingEntry_dogId_day_idx" ON "TrainingEntry"("dogId", "day");
ALTER TABLE "TrainingEntry" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "TrainingEntry" FROM anon, authenticated;
