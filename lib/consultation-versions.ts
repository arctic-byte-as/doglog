import type { Consultation, Dog, Prisma } from '@prisma/client';
import prisma from './prisma';

export type PublishedConsultationRecord = Consultation & { dog: Dog };
export type ConsultationPublication = {
  id: string;
  consultationId: string;
  version: number;
  publishedAt: Date;
  publishedById: string | null;
};
export type PublishedConsultation = {
  consultation: PublishedConsultationRecord;
  version: ConsultationPublication;
};

// Explicit allowlist: auth identities, tokens and unrelated records never enter a snapshot.
export function snapshotConsultation(record: PublishedConsultationRecord): Prisma.InputJsonValue {
  return {
    schemaVersion: 1,
    id: record.id,
    date: record.date.toISOString(),
    focus: record.focus,
    outcome: record.outcome,
    generalDescription: record.generalDescription,
    dogBreed: record.dogBreed,
    learningHistory: record.learningHistory,
    situation: record.situation,
    nutrition: record.nutrition,
    health: record.health,
    hormoneAnalysis: record.hormoneAnalysis,
    activation: record.activation,
    stimulusAnalysis: record.stimulusAnalysis,
    prescribedPlan: record.prescribedPlan,
    dogId: record.dogId,
    dog: {
      id: record.dog.id,
      name: record.dog.name,
      age: record.dog.age,
      breed: record.dog.breed,
      status: record.dog.status,
      owner: record.dog.owner,
      lastIncident: record.dog.lastIncident,
      profileImageUrl: record.dog.profileImageUrl,
      trainerId: record.dog.trainerId,
      customerId: record.dog.customerId,
    },
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function hydrateConsultationSnapshot(snapshot: unknown): PublishedConsultationRecord {
  if (!object(snapshot) || snapshot.schemaVersion !== 1 || !object(snapshot.dog)) {
    throw new Error('Unsupported consultation snapshot.');
  }
  const date = typeof snapshot.date === 'string' ? new Date(snapshot.date) : new Date(NaN);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid consultation snapshot date.');
  for (const key of ['id', 'dogId', 'focus', 'outcome'] as const) {
    if (typeof snapshot[key] !== 'string') throw new Error('Invalid consultation snapshot.');
  }
  for (const key of ['id', 'name', 'age', 'breed', 'status', 'owner', 'trainerId'] as const) {
    if (typeof snapshot.dog[key] !== 'string') throw new Error('Invalid consultation dog snapshot.');
  }
  if (snapshot.dogId !== snapshot.dog.id) throw new Error('Invalid consultation snapshot dog.');
  const optional = (value: unknown) => typeof value === 'string' ? value : null;
  return {
    id: snapshot.id as string,
    date,
    dogId: snapshot.dogId as string,
    focus: snapshot.focus as string,
    outcome: snapshot.outcome as string,
    generalDescription: optional(snapshot.generalDescription),
    dogBreed: optional(snapshot.dogBreed),
    learningHistory: optional(snapshot.learningHistory),
    situation: optional(snapshot.situation),
    nutrition: optional(snapshot.nutrition),
    health: optional(snapshot.health),
    hormoneAnalysis: optional(snapshot.hormoneAnalysis),
    activation: optional(snapshot.activation),
    stimulusAnalysis: optional(snapshot.stimulusAnalysis),
    prescribedPlan: optional(snapshot.prescribedPlan),
    dog: {
      id: snapshot.dog.id as string,
      name: snapshot.dog.name as string,
      age: snapshot.dog.age as string,
      breed: snapshot.dog.breed as string,
      status: snapshot.dog.status as string,
      owner: snapshot.dog.owner as string,
      trainerId: snapshot.dog.trainerId as string,
      customerId: optional(snapshot.dog.customerId),
      lastIncident: optional(snapshot.dog.lastIncident),
      profileImageUrl: optional(snapshot.dog.profileImageUrl),
    },
  };
}

const publicationSelect = {
  id: true,
  consultationId: true,
  version: true,
  publishedAt: true,
  publishedById: true,
  snapshot: true,
} as const;

type VersionWithSnapshot = ConsultationPublication & { snapshot: Prisma.JsonValue };

function forCustomer(record: VersionWithSnapshot, customerId: string): PublishedConsultation | null {
  try {
    const consultation = hydrateConsultationSnapshot(record.snapshot);
    // A transferred dog must not expose the former customer's historical data.
    if (consultation.dog.customerId !== customerId || consultation.id !== record.consultationId) return null;
    const { snapshot: _snapshot, ...version } = record;
    return { consultation, version };
  } catch {
    return null;
  }
}

export async function getCustomerPublishedConsultation(id: string, customerId: string, versionId?: string): Promise<PublishedConsultation | null> {
  if (!id || !customerId || versionId === '') return null;
  const version = await prisma.consultationVersion.findFirst({
    where: {
      consultationId: id,
      ...(versionId ? { id: versionId } : {}),
      consultation: { dog: { customerId } },
      snapshot: { path: ['dog', 'customerId'], equals: customerId },
    },
    orderBy: { version: 'desc' },
    select: publicationSelect,
  });
  return version ? forCustomer(version, customerId) : null;
}

export async function getCustomerConsultationVersions(customerId: string): Promise<PublishedConsultation[]> {
  if (!customerId) return [];
  const versions = await prisma.consultationVersion.findMany({
    where: {
      consultation: { dog: { customerId } },
      snapshot: { path: ['dog', 'customerId'], equals: customerId },
    },
    orderBy: [{ publishedAt: 'desc' }, { version: 'desc' }],
    select: publicationSelect,
  });
  return versions.map((version) => forCustomer(version, customerId)).filter((entry): entry is PublishedConsultation => entry !== null);
}

export async function getCustomerPublishedConsultations(customerId: string): Promise<PublishedConsultation[]> {
  const versions = await getCustomerConsultationVersions(customerId);
  const latest = new Map<string, PublishedConsultation>();
  for (const entry of versions) {
    const previous = latest.get(entry.version.consultationId);
    if (!previous || entry.version.version > previous.version.version) latest.set(entry.version.consultationId, entry);
  }
  return [...latest.values()];
}

export async function getCustomerPreviousConsultationVersions(consultationId: string, customerId: string, beforeVersion: number): Promise<PublishedConsultation[]> {
  if (!consultationId || !customerId || !Number.isInteger(beforeVersion) || beforeVersion <= 1) return [];
  const rows = await prisma.consultationVersion.findMany({
    where: { consultationId, version: { lt: beforeVersion }, consultation: { dog: { customerId } }, snapshot: { path: ['dog', 'customerId'], equals: customerId } },
    orderBy: { version: 'desc' }, select: publicationSelect,
  });
  return rows.map((row) => forCustomer(row, customerId)).filter((item): item is PublishedConsultation => item !== null);
}
