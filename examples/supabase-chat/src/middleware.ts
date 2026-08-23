import { NextResponse, type NextRequest } from "next/server";

/**
 * Minimal middleware that passes requests through.
 * Auth/session handling has been removed during the Supabase to Lumina migration.
 */
export async function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
