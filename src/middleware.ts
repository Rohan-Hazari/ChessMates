import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "./lib/redis";

const rateLimitedPaths = ["/api/community/post/vote"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (rateLimitedPaths.some((p) => path.startsWith(p))) {
    const ip =
      request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
};
