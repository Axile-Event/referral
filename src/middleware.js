import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 1. Get the shared auth cookie
  const authCookie = request.cookies.get('axile_shared_auth')?.value
  let isAuthenticated = !!authCookie

  // 2. Define path groups
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isProtectedPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname.startsWith('/referrals') || pathname === '/wallet'

  // 3. Redirect Authenticated users away from Login/Signup
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 4. Redirect Unauthenticated users away from Protected pages
  if (!isAuthenticated && isProtectedPage) {
    const mainAppUrl = (process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://app.axile.ng').replace(/\/$/, '')
    const callbackUrl = encodeURIComponent(request.url)
    return NextResponse.redirect(`${mainAppUrl}/login?callbackUrl=${callbackUrl}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard',
    '/dashboard/:path*',
    '/referrals/:path*',
    '/wallet'
  ],
}
