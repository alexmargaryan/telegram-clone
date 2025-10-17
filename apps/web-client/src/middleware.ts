import { NextResponse, NextRequest } from "next/server";

import { baseURL } from "@/constants/common";
import { isAuthRoute, isProtectedRoute } from "@/lib/auth";

import { ROUTES } from "./lib/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = isProtectedRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  // Get cookies from the request
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If accessing a protected route
  if (isProtected) {
    // If no tokens are present, redirect to signin
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
    }

    // If only refresh token is present, try to get new pair of tokens
    if (!accessToken && refreshToken) {
      try {
        const response = await fetch(`${baseURL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
        }

        // Get the new cookies from the response
        const setCookieHeaders = response.headers.getSetCookie();
        const responseWithCookies = NextResponse.next();

        // Set the new cookies
        setCookieHeaders.forEach((cookie) => {
          responseWithCookies.headers.append("Set-Cookie", cookie);
        });

        return responseWithCookies;
      } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
      }
    }

    if (accessToken) {
      return NextResponse.next();
    }
  }

  // If accessing auth routes while having tokens, redirect to dashboard
  if (isAuth && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
