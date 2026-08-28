import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { EXAM_STUDENT_ENTRY, isExamOnlyMode } from "@/lib/exam/config";

const BLOCKED_PREFIXES = [
  "/login",
  "/register",
  "/onboarding",
  "/student",
  "/mentor",
];

export function middleware(request: NextRequest) {
  if (!isExamOnlyMode()) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(EXAM_STUDENT_ENTRY, request.url));
  }

  if (BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.redirect(new URL(EXAM_STUDENT_ENTRY, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/onboarding", "/student/:path*", "/mentor/:path*"],
};
