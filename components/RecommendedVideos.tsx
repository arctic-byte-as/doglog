import SkillsVideoGallery from './SkillsVideoGallery';
import type { CoreSkill } from '@/lib/skills-library';
import type { RecommendedVideo } from '@/lib/recommended-videos';

export default function RecommendedVideos({ videos, locale, showSearch = true }: { showSearch?: boolean; videos: RecommendedVideo[]; locale: 'en' | 'nb' }) {
  if (!videos.length) return <p className="text-sm leading-6">{locale === 'nb' ? 'Treneren din legger snart til videoer og treningstips her.' : 'Your trainer will add your recommended videos and practice tips here.'}</p>;
  const subjects = new Map<string, CoreSkill>();
  for (const video of videos) {
    if (!subjects.has(video.subject)) subjects.set(video.subject, { title: video.subject, summary: '', subcategories: [] });
    subjects.get(video.subject)!.subcategories.push({ title: video.title, goal: '', steps: video.notes, coachingNotes: '', youtubeUrl: video.youtubeUrl });
  }
  return <SkillsVideoGallery skills={[...subjects.values()]} locale={locale} showSearch={showSearch} inlinePlayback />;
}
