import { requireCustomer } from '@/lib/auth';
import { uploadDogPhoto } from '@/lib/dog-photo-upload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await requireCustomer();
  return uploadDogPhoto(request, user.customer.id);
}
