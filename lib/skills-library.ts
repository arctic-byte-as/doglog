import prisma from './prisma';

export type SkillLocale = 'nb';

export type SkillTranslation = {
  title?: string;
  summary?: string;
  goal?: string;
  steps?: string;
  coachingNotes?: string;
};

export type SkillSubcategoryTranslation = SkillTranslation;

export type CoreSkillTranslation = SkillTranslation;

export type SkillSubcategory = {
  title: string;
  goal: string;
  steps: string;
  coachingNotes: string;
  youtubeUrl: string;
  translations?: Partial<Record<SkillLocale, SkillSubcategoryTranslation>>;
};

export type CoreSkill = {
  title: string;
  summary: string;
  subcategories: SkillSubcategory[];
  translations?: Partial<Record<SkillLocale, CoreSkillTranslation>>;
};

export const skillsLibraryContentKey = 'skills-library';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function normalizeTranslation(value: unknown): SkillTranslation | undefined {
  if (!isRecord(value)) return undefined;

  const translation: SkillTranslation = {
    title: asString(value.title).trim(),
    summary: asString(value.summary),
    goal: asString(value.goal),
    steps: asString(value.steps),
    coachingNotes: asString(value.coachingNotes),
  };

  const normalized = Object.fromEntries(Object.entries(translation).filter(([, entry]) => Boolean(entry))) as SkillTranslation | undefined;

  return normalized && Object.keys(normalized).length ? normalized : undefined;
}

function normalizeTranslations(value: unknown): Partial<Record<SkillLocale, SkillTranslation>> | undefined {
  if (!isRecord(value)) return undefined;

  const nb = normalizeTranslation(value.nb);
  return nb ? { nb } : undefined;
}

export function normalizeSkillsLibrary(value: unknown): CoreSkill[] | null {
  if (!Array.isArray(value)) return null;

  const skills = value
    .map((skill) => {
      if (!isRecord(skill)) return null;

      const subcategories = Array.isArray(skill.subcategories)
        ? skill.subcategories
            .map((subcategory) => {
              if (!isRecord(subcategory)) return null;

              const translations = normalizeTranslations(subcategory.translations);
              const normalizedSubcategory: SkillSubcategory = {
                title: asString(subcategory.title).trim(),
                goal: asString(subcategory.goal),
                steps: asString(subcategory.steps),
                coachingNotes: asString(subcategory.coachingNotes),
                youtubeUrl: asString(subcategory.youtubeUrl).trim(),
              };

              if (translations) normalizedSubcategory.translations = translations;

              return normalizedSubcategory;
            })
            .filter((subcategory): subcategory is SkillSubcategory => Boolean(subcategory?.title))
        : [];

      const translations = normalizeTranslations(skill.translations);
      const normalized: CoreSkill = {
        title: asString(skill.title).trim(),
        summary: asString(skill.summary),
        subcategories,
      };

      if (translations) normalized.translations = translations;

      return normalized.title ? normalized : null;
    })
    .filter((skill): skill is CoreSkill => Boolean(skill));

  return skills.length ? skills : null;
}

export async function getStoredSkillsLibrary() {
  const content = await prisma.appContent.findUnique({ where: { key: skillsLibraryContentKey } });
  if (!content) return null;

  try {
    return normalizeSkillsLibrary(JSON.parse(content.value));
  } catch {
    return null;
  }
}

export async function saveStoredSkillsLibrary(skills: CoreSkill[]) {
  return prisma.appContent.upsert({
    where: { key: skillsLibraryContentKey },
    create: {
      key: skillsLibraryContentKey,
      value: JSON.stringify(skills),
    },
    update: {
      value: JSON.stringify(skills),
    },
  });
}
