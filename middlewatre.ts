import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/clubs/:path*', '/events/:path*', '/sign-in', '/sign-up', '/users'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated, restrict access to clubs and events pages
  if (!token && (url.pathname.startsWith('/clubs') || url.pathname.startsWith('/events'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If user is authenticated, check their role and clubRole
  if (token) {
    // Redirect non-admins who are trying to access club-related pages (if needed)
    if (
      (url.pathname.startsWith('/clubs') || url.pathname.startsWith('/events')) &&
      token.role !== 'admin'
    ) {
      // Example: restrict users without club membership from accessing club pages
      if (!token.clubRole || token.clubRole === 'non-member') {
        // Redirect non-members to an error page or home page
        return NextResponse.redirect(new URL('/error', request.url));
      }

      // Additional logic can be added to allow specific club roles like "president" or "member"
      if (url.pathname.startsWith('/clubs') && token.clubRole === 'president') {
        // Allow presidents to access club pages with additional privileges
        return NextResponse.next();
      }

      if (url.pathname.startsWith('/events') && token.clubRole === 'member') {
        // Allow regular members to access events within their club
        return NextResponse.next();
      }
    }
  }

  // Default case: Allow request to proceed
  return NextResponse.next();
}
