import { authMiddleware } from "@clerk/nextjs";

// See https://clerk.com/docs/references/nextjs/auth-middleware for more info
export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/pricing",
    "/guidebooks/(.*)/view",
    "/api(.*)", // Make all API routes public for now
  ],
  ignoredRoutes: [
    "/api/test",
    "/api/stripe/test",
    "/api/stripe/success",
    "/api/webhooks(.*)",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Skip static files and _next
    "/(api|trpc)(.*)", // Include API routes
  ],
}; 