import { NextRequest, NextResponse } from "next/server";
import {
  setProgramStudioCookie,
  verifyProgramStudioPassword,
} from "@/lib/program/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!verifyProgramStudioPassword(body.password ?? "")) {
    return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  setProgramStudioCookie(res);
  return res;
}
