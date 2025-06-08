import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define protected route patterns
// These routes require authentication to access
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile/edit",
  "/bookmarks",
  "/settings",
  "/orders",
  "/wallets",
];

// Routes that should be accessible only to non-authenticated users
const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/verify-reset-code",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Check if the current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route (sign-in, sign-up, etc.)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Special handling for gig edit routes
  const isGigEditRoute = pathname.match(/^\/gigs\/[^\/]+\/edit$/);

  // If it's a protected route or gig edit route, check authentication
  if (isProtectedRoute || isGigEditRoute) {
    if (!token) {
      // No token, redirect to sign-in with callback URL
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("callback-url", pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify the JWT token
      // Note: In production, use the same JWT_SECRET as your server
      jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Token is valid, allow the request to continue
      return NextResponse.next();
    } catch {
      // Token is invalid or expired, redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("callback-url", pathname);

      // Clear the invalid token
      const response = NextResponse.redirect(url);
      response.cookies.delete("token");
      return response;
    }
  }

  // If user is authenticated and trying to access auth routes, redirect to home
  if (isAuthRoute && token) {
    try {
      // Verify the token is valid
      jwt.verify(token, process.env.JWT_SECRET!);

      // Token is valid, redirect to home or dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } catch {
      // Token is invalid, allow access to auth routes
      // and clear the invalid token
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // For all other routes, allow the request to continue
  return NextResponse.next();
}

// Configure which routes the middleware should run on
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
