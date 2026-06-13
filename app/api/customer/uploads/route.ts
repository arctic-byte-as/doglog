import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCustomer } from '@/lib/auth';

const allowedTypes: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const bucketName = process.env.SUPABASE_STORAGE_DOG_IMAGES_BUCKET || 'dog-profile-images';
let bucketReady = false;

export const runtime = 'nodejs';

function getSupabaseStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Supabase Storage upload credentials are missing. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function ensureBucket() {
  if (bucketReady) return;

  const supabase = getSupabaseStorageClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = buckets.some((bucket) => bucket.name === bucketName);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: Object.keys(allowedTypes),
      fileSizeLimit: '4MB',
    });

    if (createError) throw createError;
  }

  bucketReady = true;
}

export async function POST(request: Request) {
  const user = await requireCustomer();

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

  try {
    await ensureBucket();
  } catch (error) {
    console.error('Dog image storage setup failed', error);
    return NextResponse.json(
      { error: 'Photo uploads are not configured yet. Please contact Norse Paw support.' },
      { status: 500 },
    );
  }

  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const objectPath = `${user.customer.id}/${filename}`;
  const supabase = getSupabaseStorageClient();

  const { error } = await supabase.storage.from(bucketName).upload(objectPath, bytes, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('Dog image upload failed', error);
    return NextResponse.json({ error: 'Could not upload image.' }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
