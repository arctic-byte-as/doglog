import prisma from './prisma';

export type SkillSubcategory = {
  title: string;
  goal: string;
  steps: string;
  coachingNotes: string;
  youtubeUrl: string;
};

export type CoreSkill = {
  title: string;
  summary: string;
  subcategories: SkillSubcategory[];
};

export const skillsLibraryContentKey = 'skills-library';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
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

              return {
                title: asString(subcategory.title).trim(),
                goal: asString(subcategory.goal),
                steps: asString(subcategory.steps),
                coachingNotes: asString(subcategory.coachingNotes),
                youtubeUrl: asString(subcategory.youtubeUrl).trim(),
              };
            })
            .filter((subcategory): subcategory is SkillSubcategory => Boolean(subcategory?.title))
        : [];

      const normalized = {
        title: asString(skill.title).trim(),
        summary: asString(skill.summary),
        subcategories,
      };

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
