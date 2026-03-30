import type { H3Event } from 'h3'

const COOKIE_NAME = 'admin_token'

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME)
}

export function getAuthUser(event: H3Event): { userId: string, email: string } | null {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  return verifyToken(token)
}
