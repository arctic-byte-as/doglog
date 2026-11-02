-- Published versions are immutable snapshots, including both language PDF bytes.
CREATE TABLE "ConsultationVersion" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedById" TEXT,
    "requestId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "pdfEn" BYTEA NOT NULL,
    "pdfNb" BYTEA NOT NULL,
    CONSTRAINT "ConsultationVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ConsultationVersion_version_positive" CHECK ("version" > 0),
    CONSTRAINT "ConsultationVersion_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ConsultationVersion_requestId_key" ON "ConsultationVersion"("requestId");
CREATE UNIQUE INDEX "ConsultationVersion_consultationId_version_key" ON "ConsultationVersion"("consultationId", "version");
CREATE INDEX "ConsultationVersion_consultationId_publishedAt_idx" ON "ConsultationVersion"("consultationId", "publishedAt");
ALTER TABLE "ConsultationVersion" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "ConsultationVersion" FROM anon, authenticated;

CREATE FUNCTION reject_consultation_version_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Published consultation versions cannot be changed or deleted';
END;
$$;
CREATE TRIGGER "ConsultationVersion_immutable"
BEFORE UPDATE OR DELETE ON "ConsultationVersion"
FOR EACH ROW EXECUTE FUNCTION reject_consultation_version_mutation();
