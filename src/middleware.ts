import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = ["/", "/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    publicPaths.some((p) => path.startsWith(p)) ||
    path.includes("_next") ||
    path.includes("static") ||
    path.includes("images")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Store token in request headers to avoid re-fetching
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-auth-token", JSON.stringify(token));

  return NextResponse.next({
    headers: requestHeaders,
  });
}

export const config = {
  matcher: "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
};
