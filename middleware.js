import { verifyToken } from 'lib/helper';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request?.cookies?.get('token') || null;
  const userId = await verifyToken(token);
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/login') ||
    userId ||
    pathname.includes('/static')
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
