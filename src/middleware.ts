import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // finding the user path
  const path = request.nextUrl.pathname

  //  defining the public paths
  const isPublicPath =
    path === '/login' || path === '/signup' || path === '/verifyemail'

  // checking if the user is login
  const token = request.cookies.get('token')?.value || ''

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/signup', '/login', '/profile', '/verifyemail'],
}
