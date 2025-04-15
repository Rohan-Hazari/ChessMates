import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ratelimit } from "./lib/redis";

const publicPaths = ["/", "/sign-in", "/sign-up"];

const rateLimitedPaths = ["/api/community/post/vote"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (rateLimitedPaths.some((p) => path.startsWith(p))) {
    const ip =
      request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    console.log(
      `[RateLimit] IP: ${ip} | Success: ${success} | Limit: ${limit} | Remaining: ${remaining} | Reset: ${reset}`
    );

    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
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
