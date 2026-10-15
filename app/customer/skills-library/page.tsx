import { SiteShell } from '@/components/SiteShell';
import SkillsVideoGallery from '@/components/SkillsVideoGallery';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import { getStoredSkillsLibrary } from '@/lib/skills-library';
import { defaultSkills } from '@/lib/skills-library-defaults';

export default async function CustomerSkillsLibraryPage() {
  await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const skills = await getStoredSkillsLibrary() || defaultSkills;
  return <SiteShell><div className="customer-home dashboard-colour-preview space-y-6"><div className="dashboard-intro"><h1 className="text-2xl font-semibold sm:text-3xl">{t.library.skills}</h1><p className="dashboard-intro-copy mt-2 text-sm leading-6">{locale === 'nb' ? 'Finn en ferdighet, velg en video og tren i ditt eget tempo.' : 'Find a skill, choose a video and practise at your own pace.'}</p></div><SkillsVideoGallery skills={skills} locale={locale} /></div></SiteShell>;
}
