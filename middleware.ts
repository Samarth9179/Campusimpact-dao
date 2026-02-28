import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const { data: { session } } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // If trying to access /app/* and not logged in → redirect to login
    if (pathname.startsWith('/app') && !session) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and visiting auth pages → redirect to app
    if ((pathname.startsWith('/auth')) && session) {
        return NextResponse.redirect(new URL('/app', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
};
