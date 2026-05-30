-- Doglog Supabase baseline.
-- Apply this to a clean Supabase Postgres database before importing seed data.

CREATE TABLE "Trainer" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomerServiceAccess" (
  "id" TEXT NOT NULL,
  "serviceKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "customerId" TEXT NOT NULL,
  CONSTRAINT "CustomerServiceAccess_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Dog" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "age" TEXT NOT NULL,
  "breed" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "lastIncident" TEXT,
  "profileImageUrl" TEXT,
  "trainerId" TEXT NOT NULL,
  "customerId" TEXT,
  CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Observation" (
  "id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "trigger" TEXT NOT NULL,
  "notes" TEXT NOT NULL,
  "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dogId" TEXT NOT NULL,
  CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Consultation" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "focus" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "generalDescription" TEXT,
  "dogBreed" TEXT,
  "learningHistory" TEXT,
  "situation" TEXT,
  "nutrition" TEXT,
  "health" TEXT,
  "hormoneAnalysis" TEXT,
  "activation" TEXT,
  "stimulusAnalysis" TEXT,
  "prescribedPlan" TEXT,
  "dogId" TEXT NOT NULL,
  CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceSession" (
  "id" TEXT NOT NULL,
  "serviceKey" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "focus" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "generalDescription" TEXT,
  "dogBreed" TEXT,
  "learningHistory" TEXT,
  "situation" TEXT,
  "nutrition" TEXT,
  "health" TEXT,
  "hormoneAnalysis" TEXT,
  "activation" TEXT,
  "stimulusAnalysis" TEXT,
  "prescribedPlan" TEXT,
  "dogId" TEXT NOT NULL,
  CONSTRAINT "ServiceSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMP(3),
  "role" TEXT NOT NULL DEFAULT 'TRAINER',
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "Trainer_email_key" ON "Trainer"("email");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "CustomerServiceAccess_customerId_serviceKey_key" ON "CustomerServiceAccess"("customerId", "serviceKey");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

ALTER TABLE "CustomerServiceAccess"
  ADD CONSTRAINT "CustomerServiceAccess_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Dog"
  ADD CONSTRAINT "Dog_trainerId_fkey"
  FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Dog"
  ADD CONSTRAINT "Dog_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Observation"
  ADD CONSTRAINT "Observation_dogId_fkey"
  FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Consultation"
  ADD CONSTRAINT "Consultation_dogId_fkey"
  FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ServiceSession"
  ADD CONSTRAINT "ServiceSession_dogId_fkey"
  FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Account"
  ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
