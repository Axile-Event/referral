import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 1. Get the shared auth cookie
  const authCookie = request.cookies.get('axile_shared_auth')?.value
  let isAuthenticated = !!authCookie

  // 2. Define path groups
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/referrals') || pathname === '/'

  // 3. Handle Root Path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(isAuthenticated ? '/dashboard' : '/login', request.url))
  }

  // 4. Redirect Authenticated users away from Login/Signup
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 4. Redirect Unauthenticated users away from Protected pages
  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/referrals/:path*'
  ],
}
