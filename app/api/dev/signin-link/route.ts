import { NextResponse } from 'next/server';
import { readDevSigninLink } from '@/lib/dev-signin-link';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const link = await readDevSigninLink();
  return NextResponse.json({ link });
}
