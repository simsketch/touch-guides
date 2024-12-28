import { clerkMiddleware } from '@clerk/nextjs/server';

const publicPaths = [
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
];

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return;
  }

  return auth().then((session) => {
    if (!session.userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }
  });
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 