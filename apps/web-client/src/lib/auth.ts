/**
 * Authentication utility functions
 */
import { ROUTES } from "./routes";

export const AUTH_ROUTES = [ROUTES.SIGNIN, ROUTES.SIGNUP] as const;
export const PROTECTED_ROUTES = [ROUTES.CHATS] as const;

/**
 * Check if a pathname is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a pathname is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}
