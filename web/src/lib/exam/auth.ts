import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "pepsinogen_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pepsinogen1404";

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}

export function setAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.delete(ADMIN_COOKIE);
}

export async function requireAdmin(request?: NextRequest): Promise<NextResponse | null> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  return null;
}
