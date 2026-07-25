import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STUDIO_COOKIE = "pepsino_program_studio";
const STUDIO_PASSWORD =
  process.env.PROGRAM_STUDIO_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  "pepsinogen1404";

export function verifyProgramStudioPassword(password: string): boolean {
  return password === STUDIO_PASSWORD;
}

export async function isProgramStudioAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(STUDIO_COOKIE)?.value === "authenticated";
}

export function setProgramStudioCookie(response: NextResponse) {
  response.cookies.set(STUDIO_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearProgramStudioCookie(response: NextResponse) {
  response.cookies.delete(STUDIO_COOKIE);
}

export async function requireProgramStudio(): Promise<NextResponse | null> {
  const authed = await isProgramStudioAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  return null;
}
