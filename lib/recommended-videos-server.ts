import prisma from './prisma';
import { parseRecommendedVideos, recommendedVideosKey } from './recommended-videos';

export async function getRecommendedVideos(customerId: string) {
  const content = await prisma.appContent.findUnique({ where: { key: recommendedVideosKey(customerId) } });
  try { return content ? parseRecommendedVideos(JSON.parse(content.value)) || [] : []; }
  catch { return []; }
}
