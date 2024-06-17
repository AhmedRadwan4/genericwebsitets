import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  Default_Login_Redirect,
  authRoutes,
  publicRoutes,
} from "@/routes";

// Initialize NextAuth
export const { auth } = NextAuth(authConfig);

// Utility function to construct URLs
const constructUrl = (path: string | URL, baseUrl: string | URL | undefined) =>
  new URL(path, baseUrl);

// Middleware function to handle authentication and authorization
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API authentication routes to pass through
  if (isApiAuthRoute) {
    return;
  }

  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(constructUrl(Default_Login_Redirect, nextUrl));
    }
    return;
  }

  // Redirect unauthenticated users from protected routes to the login page
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(constructUrl("/auth/login", nextUrl));
  }

  // Allow all other requests to pass through
  return;
});

// Optional configuration to specify which paths to invoke middleware on
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
