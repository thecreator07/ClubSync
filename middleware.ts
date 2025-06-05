import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/clubs/:path*', '/events/:path*', '/sign-in', '/sign-up', '/users/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname
  console.log(token, 'token in middleware')
  // Redirect to dashboard if the user is already authenticated and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (path.startsWith('/sign-in') ||
      path.startsWith('/sign-up') ||
      path.startsWith('/verify') ||
      path === '/'
    )
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && (path.startsWith('/clubs') || path.startsWith('/events'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (token && path.startsWith('/events/create')) {
    if (['president', 'secretary', 'treasurer'].includes(token?.clubRole || '')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/error', request.url))
    }
  }

  if (token && path.startsWith('/clubs/create')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/error', request.url))
    }
  }


  // If user is not authenticated, restrict access to clubs and events pages

  // If user is authenticated, check their role and clubRole
  if (token && (path.startsWith('/clubs') || path.startsWith('/events'))) {
    // must be admin or a club member
    // if (token.role !== 'admin') {
    //   if (!token.clubRole || token.clubRole === 'non-member') {
    //     return NextResponse.redirect(new URL('/error', request.url))
    //   }
    // }

    // presidents get full /clubs, members get /events
    if (path.startsWith('/clubs') && ["president", "secretary", "treasurer"].includes(token?.clubRole ?? '')) {
      return NextResponse.next()
    }

    if (path.startsWith('/events') && token.clubRole === 'member') {
      return NextResponse.next()
    }
  }


  //if user is authenticated and trying to acces his profile page,allow access
  if (token && path.startsWith('/users')) {
    const userId = token.id.toString()
    const userPath = path.split('/')[2]
    const actionPath = path.split('/')[3]
    console.log("userPath", userPath)
    if (userId === userPath) {
      return NextResponse.next()
    } else if (actionPath === 'verify-code') {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/error', request.url))
    }
  }

  if (token && path.startsWith('/clubs')) {
    const uploadPath = path.split('/')[3]
    if (uploadPath === 'upload') {
      if (token.clubRole === 'president' || token.clubRole === 'secretary' || token.clubRole === 'treasurer' || token.role === 'admin') {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL('/error', request.url))
      }
    }
  }

  if (token && path.startsWith('/events')) {
    const uploadPath = path.split('/')[3]
    if (uploadPath === 'upload') {
      if (token.clubRole === 'president' || token.clubRole === 'secretary' || token.clubRole === 'treasurer' || token.role === 'admin') {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL('/error', request.url))
      }
    }
  }
  

  // Default case: Allow request to proceed
  return NextResponse.next();
}
