import { requireTrainer } from '@/lib/auth';
import { uploadDogPhoto } from '@/lib/dog-photo-upload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await requireTrainer();
  return uploadDogPhoto(request, `trainer-${user.trainer.id}`);
}
