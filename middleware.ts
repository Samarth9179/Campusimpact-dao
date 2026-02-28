import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Supabase stores the session in a cookie named sb-<project-ref>-auth-token
    // Check all cookies for any Supabase auth token
    const hasSession = req.cookies.getAll().some(
        c => c.name.includes('auth-token') && c.value.length > 10
    );

    // If trying to access /app/* and not logged in → redirect to login
    if (pathname.startsWith('/app') && !hasSession) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and visiting auth pages → go straight to app
    if (pathname.startsWith('/auth') && hasSession) {
        return NextResponse.redirect(new URL('/app', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
};
