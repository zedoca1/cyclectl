import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirect authenticated users from /landing to /projects
    if (token && pathname === "/landing") {
      return NextResponse.redirect(new URL("/projects", req.url));
    }

    // Redirect unauthenticated users from / to /landing
    // This catches access to /, /projects, /project/*, etc.
    if (!token && (pathname === "/" || pathname.startsWith("/projects") || pathname.startsWith("/project"))) {
      return NextResponse.redirect(new URL("/landing", req.url));
    }

    // Allow access to /landing and API routes for unauthenticated users
    // NextAuth.js will handle its own /api/auth routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public paths like /landing, /, and /api/auth/* without a token
        if (req.nextUrl.pathname === "/landing" || req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        // For other paths, require a token
        return !!token;
      },
    },
  },
);

// Matcher to apply middleware to specific paths
export const config = {
  matcher: ["/", "/projects/:path*", "/project/:path*", "/landing", "/api/auth/:path*"],
};
