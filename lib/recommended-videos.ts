import { youtubeId } from './youtube';

export type RecommendedVideo = { id: string; subject: string; title: string; youtubeUrl: string; notes: string };
export const recommendedVideosKey = (customerId: string) => `customer-videos:${customerId}`;

export function parseRecommendedVideos(value: unknown): RecommendedVideo[] | null {
  if (!Array.isArray(value) || value.length > 30) return null;
  const ids = new Set<string>();
  const result: RecommendedVideo[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') return null;
    const { id, subject, title, youtubeUrl, notes } = entry;
    if ([id, subject, title, youtubeUrl, notes].some((field) => typeof field !== 'string')) return null;
    const videoId = youtubeId(youtubeUrl);
    if (!id.trim() || id.length > 64 || ids.has(id) || !subject.trim() || subject.length > 100 || !title.trim() || title.length > 160 || notes.length > 2000 || youtubeUrl.length > 2048 || !videoId) return null;
    ids.add(id);
    result.push({ id, subject: subject.trim(), title: title.trim(), notes: notes.trim(), youtubeUrl: `https://www.youtube.com/watch?v=${videoId}` });
  }
  return result;
}
