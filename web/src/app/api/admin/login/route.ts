import { NextRequest, NextResponse } from "next/server";
import {
  setAdminCookie,
  verifyAdminPassword,
} from "@/lib/exam/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setAdminCookie(response);
  return response;
}
