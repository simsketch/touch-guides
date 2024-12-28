import { authMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/api/guidebooks/:id/view",
    "/guidebooks/:id",
    "/guidebooks/:id/info",
    "/guidebooks/:id/map",
    "/guidebooks/:id/search",
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 