import { auth } from "@/lib/auth";

const protectedRoutes = [
  "/bookmarks",
  "/settings",
  "/dashboard",
  "/profile/edit",
  "/contact-us/certificate",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Only run middleware on protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    const signInUrl = new URL(
      `/sign-in?callback-url=${callbackUrl}&error=unauthorized`,
      req.url
    );
    return Response.redirect(signInUrl);
  }

  // Check token expiration if needed
  if (req.auth?.expires) {
    const expirationTime = new Date(req.auth.expires).getTime();
    if (expirationTime < Date.now()) {
      const callbackUrl = encodeURIComponent(pathname);
      const signInUrl = new URL(
        `/sign-in?callback-url=${callbackUrl}&error=token-expired`,
        req.url
      );
      return Response.redirect(signInUrl);
    }
  }

  // Allow access - no need to return NextResponse.next()
  // The auth middleware handles this automatically
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
