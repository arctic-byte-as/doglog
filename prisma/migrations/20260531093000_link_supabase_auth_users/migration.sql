ALTER TABLE "User" ADD COLUMN "supabaseAuthId" TEXT;

CREATE UNIQUE INDEX "User_supabaseAuthId_key" ON "User"("supabaseAuthId");
