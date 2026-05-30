import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';

const allowedTypes: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  await requireCustomer();

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
  }

  const extension = allowedTypes[file.type];
  if (!extension) {
    return NextResponse.json({ error: 'Upload a PNG, JPG, WEBP, or GIF image.' }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be smaller than 4MB.' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dogs');
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ url: `/uploads/dogs/${filename}` }, { status: 201 });
}
